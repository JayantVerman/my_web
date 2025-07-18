import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  imageUrl: text("image_url"),
  technologies: text("technologies").array(),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  category: text("category").notNull(), // 'regular' or 'freelance'
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  category: text("category").notNull(), // 'frontend', 'backend', 'data', 'devops'
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;

// Website sections table for flexible content management
export const websiteSections = pgTable("website_sections", {
  id: serial("id").primaryKey(),
  sectionKey: text("section_key").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  content: text("content"),
  imageUrl: text("image_url"),
  buttonText: text("button_text"),
  buttonUrl: text("button_url"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  sectionType: text("section_type").notNull(), // 'hero', 'about', 'services', 'cta', 'card', 'grid', 'timeline', 'custom'
  layout: text("layout").default('vertical'), // 'horizontal', 'vertical', 'grid'
  targetPage: text("target_page").default('regular'), // 'regular', 'freelance'
  columns: integer("columns").default(1), // For grid layout
  gap: text("gap").default('medium'), // 'small', 'medium', 'large'
  customData: text("custom_data"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWebsiteSectionSchema = createInsertSchema(websiteSections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type WebsiteSection = typeof websiteSections.$inferSelect;
export type InsertWebsiteSection = z.infer<typeof insertWebsiteSectionSchema>;

// Personal information table
export const personalInfo = pgTable("personal_info", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  title: text("title").notNull(),
  bio: text("bio"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  profileImage: text("profile_image"),
  resumeUrl: text("resume_url"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  twitterUrl: text("twitter_url"),
  websiteUrl: text("website_url"),
  yearsOfExperience: integer("years_of_experience"),
  currentRole: text("current_role"),
  company: text("company"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPersonalInfoSchema = createInsertSchema(personalInfo).omit({
  id: true,
  updatedAt: true,
});

export type PersonalInfo = typeof personalInfo.$inferSelect;
export type InsertPersonalInfo = z.infer<typeof insertPersonalInfoSchema>;
