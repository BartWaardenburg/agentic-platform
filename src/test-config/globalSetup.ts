import { globalSetup } from "@mastra/evals";
import dotenv from "dotenv";
import path from "path";

export default function setup() {
  // Load environment variables from .env.test
  dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

  // Initialize Mastra evals global setup
  globalSetup();
}
