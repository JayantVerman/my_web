import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateToken, requireAdmin, generateToken, type AuthenticatedRequest } from "./middleware/auth";
import { insertProjectSchema, insertContactSchema, insertSkillSchema, insertWebsiteSectionSchema, insertPersonalInfoSchema, loginSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import helmet from "helmet";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { readEnvFile, writeEnvFile } from './env-utils';

// Configure multer for image upload
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "ws:", "wss:"],
      },
    },
  }));
  app.use(cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : true,
    credentials: true,
  }));

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || !user.isAdmin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user.id);
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          isAdmin: user.isAdmin 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.get("/api/auth/verify", authenticateToken, (req: AuthenticatedRequest, res) => {
    res.json({ user: req.user });
  });

  // Public project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const category = req.query.category as string;
      const projects = category 
        ? await storage.getProjectsByCategory(category)
        : await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Protected project routes
  app.post("/api/projects", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, projectData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact data" });
    }
  });

  app.get("/api/contacts", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.put("/api/contacts/:id/read", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.markContactAsRead(id);
      if (!updated) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json({ message: "Contact marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContact(id);
      if (!deleted) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json({ message: "Contact deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Testimonial routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getActiveTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Skill routes
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getActiveSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const skillData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(skillData);
      res.status(201).json(skill);
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data" });
    }
  });

  app.put("/api/skills/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const skillData = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(id, skillData);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      res.json(skill);
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data" });
    }
  });

  app.delete("/api/skills/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSkill(id);
      if (!deleted) {
        return res.status(404).json({ message: "Skill not found" });
      }
      res.json({ message: "Skill deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // Website Sections routes
  app.get("/api/website-sections", async (req, res) => {
    try {
      const sections = await storage.getWebsiteSections();
      res.json(sections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch website sections" });
    }
  });

  app.get("/api/website-sections/:key", async (req, res) => {
    try {
      const section = await storage.getWebsiteSectionByKey(req.params.key);
      if (!section) {
        return res.status(404).json({ message: "Website section not found" });
      }
      res.json(section);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch website section" });
    }
  });

  app.post("/api/website-sections", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const sectionData = insertWebsiteSectionSchema.parse(req.body);
      const section = await storage.createWebsiteSection(sectionData);
      res.status(201).json(section);
    } catch (error) {
      res.status(400).json({ message: "Invalid website section data" });
    }
  });

  app.put("/api/website-sections/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const sectionData = insertWebsiteSectionSchema.partial().parse(req.body);
      const section = await storage.updateWebsiteSection(id, sectionData);
      if (!section) {
        return res.status(404).json({ message: "Website section not found" });
      }
      res.json(section);
    } catch (error) {
      res.status(400).json({ message: "Invalid website section data" });
    }
  });

  app.delete("/api/website-sections/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteWebsiteSection(id);
      if (!deleted) {
        return res.status(404).json({ message: "Website section not found" });
      }
      res.json({ message: "Website section deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete website section" });
    }
  });

  // Personal Info routes
  app.get("/api/personal-info", async (req, res) => {
    try {
      const personalInfo = await storage.getPersonalInfo();
      res.json(personalInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch personal info" });
    }
  });

  app.put("/api/personal-info", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const personalInfoData = insertPersonalInfoSchema.parse(req.body);
      const personalInfo = await storage.updatePersonalInfo(personalInfoData);
      res.json(personalInfo);
    } catch (error) {
      console.error("Error updating personal info:", error);
      res.status(400).json({ message: "Failed to save personal information. Please try again." });
    }
  });

  // Image upload endpoint
  app.post("/api/upload", authenticateToken, requireAdmin, upload.single("image"), (req: AuthenticatedRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // Return the URL for the uploaded file
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

  // GitHub Environment Configuration
  app.get("/api/env-config", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const envConfig = readEnvFile();
      res.json({
        GITHUB_TOKEN: envConfig.GITHUB_TOKEN || '',
      });
    } catch (error) {
      console.error('Error reading environment config:', error);
      res.status(500).json({ message: "Failed to fetch environment configuration" });
    }
  });

  app.put("/api/env-config", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { GITHUB_TOKEN } = req.body;
      
      // Update .env file and process.env
      writeEnvFile({ GITHUB_TOKEN });
      
      res.json({ message: "Environment configuration updated successfully" });
    } catch (error) {
      console.error("Error updating env config:", error);
      res.status(500).json({ message: "Failed to update environment configuration" });
    }
  });

  // GitHub API Proxy Routes
  app.get("/api/github/user/:username/repos", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const response = await fetch(`https://api.github.com/users/${req.params.username}/repos`, {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch repositories');
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || "Failed to fetch GitHub repositories" });
    }
  });

  app.get("/api/github/repos/:owner/:repo", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { owner, repo } = req.params;
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch repository');
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || "Failed to fetch GitHub repository" });
    }
  });

  app.get("/api/github/repos/:owner/:repo/readme", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { owner, repo } = req.params;
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch README');
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || "Failed to fetch GitHub README" });
    }
  });

  app.get("/api/github/repos/:owner/:repo/languages", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { owner, repo } = req.params;
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch languages');
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || "Failed to fetch GitHub languages" });
    }
  });

  app.get("/api/github/repos/:owner/:repo/contributors", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { owner, repo } = req.params;
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`, {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch contributors');
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message || "Failed to fetch GitHub contributors" });
    }
  });

  // GitHub Configuration Routes
  app.get("/api/github-configs", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const configs = await storage.getGithubConfigs();
      res.json(configs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch GitHub configurations" });
    }
  });

  app.post("/api/github-configs", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const config = await storage.createGithubConfig(req.body);
      res.status(201).json(config);
    } catch (error) {
      res.status(400).json({ message: "Failed to create GitHub configuration" });
    }
  });

  app.put("/api/github-configs/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const config = await storage.updateGithubConfig(id, req.body);
      if (!config) {
        return res.status(404).json({ message: "GitHub configuration not found" });
      }
      res.json(config);
    } catch (error) {
      res.status(400).json({ message: "Failed to update GitHub configuration" });
    }
  });

  app.delete("/api/github-configs/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGithubConfig(id);
      if (!deleted) {
        return res.status(404).json({ message: "GitHub configuration not found" });
      }
      res.json({ message: "GitHub configuration deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete GitHub configuration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
