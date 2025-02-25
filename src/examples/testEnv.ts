import { config } from "dotenv";

// Load environment variables
config();

console.log("Environment variables status:", {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY?.substring(0, 10) + "...",
  RESEND_API_KEY: process.env.RESEND_API_KEY?.substring(0, 10) + "...",
  RESEND_DEFAULT_SENDER: process.env.RESEND_DEFAULT_SENDER,
});
