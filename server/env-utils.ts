import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

export interface EnvConfig {
  GITHUB_TOKEN?: string;
  [key: string]: string | undefined;
}

export function readEnvFile(): EnvConfig {
  try {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    return dotenv.parse(envContent);
  } catch (error) {
    console.error('Error reading .env file:', error);
    return {};
  }
}

export function writeEnvFile(config: EnvConfig): void {
  try {
    const envPath = path.join(process.cwd(), '.env');
    
    // Read existing .env content
    let existingConfig: EnvConfig = {};
    try {
      existingConfig = readEnvFile();
    } catch (error) {
      // File doesn't exist or can't be read, start fresh
      console.log('No existing .env file found, creating new one');
    }

    // Merge new config with existing config
    const mergedConfig = { ...existingConfig, ...config };

    // Convert to .env format
    const envContent = Object.entries(mergedConfig)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Write to file
    fs.writeFileSync(envPath, envContent);

    // Update process.env
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined) {
        process.env[key] = value;
      }
    });
  } catch (error) {
    console.error('Error writing .env file:', error);
    throw new Error('Failed to update environment configuration');
  }
} 