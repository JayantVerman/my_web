import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const username = "admin";
  const password = "admin123";
  const email = "admin@example.com";
  
  try {
    // Check if admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, username));
    
    if (existingAdmin.length > 0) {
      console.log("Admin user already exists");
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin user
    const [admin] = await db.insert(users).values({
      username,
      password: hashedPassword,
      email,
      isAdmin: true,
    }).returning();
    
    console.log("Admin user created successfully:", {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      isAdmin: admin.isAdmin,
    });
    
    console.log("\nLogin credentials:");
    console.log("Username:", username);
    console.log("Password:", password);
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
  
  process.exit(0);
}

createAdmin();