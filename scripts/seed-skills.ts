import { db } from "../server/db";
import { skills } from "../shared/schema";

async function seedSkills() {
  try {
    // Sample skills for Data Engineering and Web Development
    const sampleSkills = [
      // Data Engineering Skills
      { name: "Python", icon: "Code", color: "bg-blue-600", category: "data", order: 1 },
      { name: "AWS", icon: "Cloud", color: "bg-amber-500", category: "data", order: 2 },
      { name: "Spark SQL", icon: "Database", color: "bg-emerald-500", category: "data", order: 3 },
      { name: "PySpark", icon: "Zap", color: "bg-red-500", category: "data", order: 4 },
      { name: "PostgreSQL", icon: "Server", color: "bg-blue-700", category: "data", order: 5 },
      { name: "MongoDB", icon: "Database", color: "bg-green-600", category: "data", order: 6 },
      { name: "Snowflake", icon: "Snowflake", color: "bg-blue-400", category: "data", order: 7 },
      { name: "Git", icon: "GitBranch", color: "bg-gray-800", category: "devops", order: 8 },
      
      // Web Development Skills
      { name: "React", icon: "Code", color: "bg-blue-500", category: "frontend", order: 9 },
      { name: "Node.js", icon: "Server", color: "bg-green-600", category: "backend", order: 10 },
      { name: "TypeScript", icon: "Code", color: "bg-blue-600", category: "frontend", order: 11 },
      { name: "Docker", icon: "Cpu", color: "bg-blue-700", category: "devops", order: 12 },
      { name: "Kubernetes", icon: "Cloud", color: "bg-purple-600", category: "devops", order: 13 },
      { name: "GraphQL", icon: "Database", color: "bg-pink-600", category: "backend", order: 14 },
      { name: "Redis", icon: "Database", color: "bg-red-600", category: "backend", order: 15 },
      { name: "Nginx", icon: "Server", color: "bg-green-700", category: "devops", order: 16 },
    ];

    // Check if skills already exist
    const existingSkills = await db.select().from(skills);
    
    if (existingSkills.length === 0) {
      await db.insert(skills).values(sampleSkills);
      console.log("Sample skills inserted successfully");
    } else {
      console.log("Skills already exist, skipping insertion");
    }

    console.log("Skills seeded successfully!");
  } catch (error) {
    console.error("Error seeding skills:", error);
  }
  
  process.exit(0);
}

seedSkills();