import { users, projects, contacts, testimonials, skills, websiteSections, personalInfo, githubConfigs, type User, type InsertUser, type Project, type InsertProject, type Contact, type InsertContact, type Testimonial, type InsertTestimonial, type Skill, type InsertSkill, type WebsiteSection, type InsertWebsiteSection, type PersonalInfo, type InsertPersonalInfo, type GithubConfig, type InsertGithubConfig } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Contact methods
  getContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  markContactAsRead(id: number): Promise<boolean>;
  deleteContact(id: number): Promise<boolean>;
  
  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  getActiveTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
  
  // Skill methods
  getSkills(): Promise<Skill[]>;
  getActiveSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;

  // Website Sections methods
  getWebsiteSections(): Promise<WebsiteSection[]>;
  getWebsiteSectionByKey(sectionKey: string): Promise<WebsiteSection | undefined>;
  createWebsiteSection(section: InsertWebsiteSection): Promise<WebsiteSection>;
  updateWebsiteSection(id: number, section: Partial<InsertWebsiteSection>): Promise<WebsiteSection | undefined>;
  deleteWebsiteSection(id: number): Promise<boolean>;

  // Personal Information methods
  getPersonalInfo(): Promise<PersonalInfo | undefined>;
  createPersonalInfo(info: InsertPersonalInfo): Promise<PersonalInfo>;
  updatePersonalInfo(updateData: InsertPersonalInfo): Promise<PersonalInfo>;

  // GitHub Configuration methods
  getGithubConfigs(): Promise<GithubConfig[]>;
  getGithubConfig(id: number): Promise<GithubConfig | undefined>;
  createGithubConfig(config: InsertGithubConfig): Promise<GithubConfig>;
  updateGithubConfig(id: number, config: Partial<InsertGithubConfig>): Promise<GithubConfig | undefined>;
  deleteGithubConfig(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.category, category)).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Contact methods
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async markContactAsRead(id: number): Promise<boolean> {
    const result = await db
      .update(contacts)
      .set({ isRead: true })
      .where(eq(contacts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async deleteContact(id: number): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  }

  async getActiveTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.isActive, true)).orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }

  async updateTestimonial(id: number, updateData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .update(testimonials)
      .set(updateData)
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial || undefined;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Skill methods
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(skills.order, skills.name);
  }

  async getActiveSkills(): Promise<Skill[]> {
    return await db.select().from(skills).where(eq(skills.isActive, true)).orderBy(skills.order, skills.name);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const [skill] = await db
      .insert(skills)
      .values(insertSkill)
      .returning();
    return skill;
  }

  async updateSkill(id: number, updateData: Partial<InsertSkill>): Promise<Skill | undefined> {
    const [skill] = await db
      .update(skills)
      .set(updateData)
      .where(eq(skills.id, id))
      .returning();
    return skill || undefined;
  }

  async deleteSkill(id: number): Promise<boolean> {
    const result = await db.delete(skills).where(eq(skills.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Website Sections methods
  async getWebsiteSections(): Promise<WebsiteSection[]> {
    return await db.select().from(websiteSections).orderBy(websiteSections.order, websiteSections.createdAt);
  }

  async getWebsiteSectionByKey(sectionKey: string): Promise<WebsiteSection | undefined> {
    const [section] = await db.select().from(websiteSections).where(eq(websiteSections.sectionKey, sectionKey));
    return section || undefined;
  }

  async createWebsiteSection(insertSection: InsertWebsiteSection): Promise<WebsiteSection> {
    const [section] = await db
      .insert(websiteSections)
      .values(insertSection)
      .returning();
    return section;
  }

  async updateWebsiteSection(id: number, updateData: Partial<InsertWebsiteSection>): Promise<WebsiteSection | undefined> {
    const [section] = await db
      .update(websiteSections)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(websiteSections.id, id))
      .returning();
    return section || undefined;
  }

  async deleteWebsiteSection(id: number): Promise<boolean> {
    const result = await db.delete(websiteSections).where(eq(websiteSections.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Personal Information methods
  async getPersonalInfo(): Promise<PersonalInfo | undefined> {
    const [info] = await db.select().from(personalInfo).limit(1);
    return info || undefined;
  }

  async createPersonalInfo(insertInfo: InsertPersonalInfo): Promise<PersonalInfo> {
    const [info] = await db
      .insert(personalInfo)
      .values(insertInfo)
      .returning();
    return info;
  }

  async updatePersonalInfo(updateData: InsertPersonalInfo): Promise<PersonalInfo> {
    // Get the first record or create if doesn't exist
    let [info] = await db.select().from(personalInfo).limit(1);
    
    if (info) {
      // Update existing record
      [info] = await db
        .update(personalInfo)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(personalInfo.id, info.id))
        .returning();
    } else {
      // Create new record
      [info] = await db
        .insert(personalInfo)
        .values({ ...updateData, updatedAt: new Date() })
        .returning();
    }
    
    return info;
  }

  // GitHub Configuration methods
  async getGithubConfigs(): Promise<GithubConfig[]> {
    return await db.select().from(githubConfigs).orderBy(githubConfigs.order, githubConfigs.createdAt);
  }

  async getGithubConfig(id: number): Promise<GithubConfig | undefined> {
    const [config] = await db.select().from(githubConfigs).where(eq(githubConfigs.id, id));
    return config || undefined;
  }

  async createGithubConfig(insertConfig: InsertGithubConfig): Promise<GithubConfig> {
    const [config] = await db
      .insert(githubConfigs)
      .values(insertConfig)
      .returning();
    return config;
  }

  async updateGithubConfig(id: number, updateData: Partial<InsertGithubConfig>): Promise<GithubConfig | undefined> {
    const [config] = await db
      .update(githubConfigs)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(githubConfigs.id, id))
      .returning();
    return config || undefined;
  }

  async deleteGithubConfig(id: number): Promise<boolean> {
    const result = await db.delete(githubConfigs).where(eq(githubConfigs.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
