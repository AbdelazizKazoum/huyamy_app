// scripts/initConfig.ts
import { initializeSiteConfig } from "@/lib/services/configService";

async function initConfig() {
  try {
    console.log("🚀 Initializing site configuration...");
    await initializeSiteConfig();
    console.log("✅ Site configuration initialized successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to initialize site configuration:", error);
    process.exit(1);
  }
}

initConfig();
