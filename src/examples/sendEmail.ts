import { config } from "dotenv";
import { mastra } from "../mastra";

// Load environment variables
config();

/* Type for agent response */
type AgentResponse = {
  text: string;
};

/* Timeout durations in milliseconds */
const TIMEOUTS = {
  TOTAL: 300000, // 5 minutes total
  COMPOSE: 120000, // 2 minutes for composition
  TEMPLATE: 120000, // 2 minutes for template creation
  SEND: 60000, // 1 minute for sending
};

/**
 * Extracts and processes memory updates from agent response
 */
const processMemoryUpdates = (response: string) => {
  const memoryMatch = response.match(
    /<working_memory>[\s\S]*?<\/working_memory>/,
  );
  if (memoryMatch) {
    console.log("📝 Memory Update Processed:", {
      preferences: response.match(/<preferences>[\s\S]*?<\/preferences>/)?.[0],
      statistics: response.match(/<statistics>[\s\S]*?<\/statistics>/)?.[0],
      templates: response.match(
        /<recent_templates>[\s\S]*?<\/recent_templates>/,
      )?.[0],
    });
  }
  return response
    .replace(/<working_memory>[\s\S]*?<\/working_memory>/g, "")
    .trim();
};

console.log("🔧 Environment setup:", {
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  hasResendKey: !!process.env.RESEND_API_KEY,
  hasDefaultSender: !!process.env.RESEND_DEFAULT_SENDER,
});

/**
 * Creates a promise that rejects after a specified timeout
 */
const createTimeout = (ms: number, operation: string): Promise<never> =>
  new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          `${operation} operation timed out after ${ms / 1000} seconds`,
        ),
      );
    }, ms);
  });

/**
 * Example of sending an email using the supervisor agent
 */
const sendEmail = async () => {
  console.log("🚀 Starting email sending process...");

  const agent = mastra.getAgent("supervisorEmailAgent");
  console.log("✅ Got supervisor agent");

  try {
    console.log("📨 Sending request to agent...");

    // Create timeouts for different operations
    const totalTimeout = createTimeout(TIMEOUTS.TOTAL, "Total email sending");
    const composeTimeout = createTimeout(TIMEOUTS.COMPOSE, "Email composition");
    const templateTimeout = createTimeout(
      TIMEOUTS.TEMPLATE,
      "Template creation",
    );
    const sendTimeout = createTimeout(TIMEOUTS.SEND, "Email sending");

    // Race between the agent operation and the timeouts
    const response = await Promise.race([
      agent.generate(
        `
        Please send an email with the following details:
        To: example@email.com
        Subject: Welcome to our platform
        Tone: friendly
        Key points:
        - Thank them for joining
        - Explain next steps
        - Provide support contact
        `,
        {
          // Add memory configuration
          resourceId: "user_123",
          threadId: "welcome_emails",
          memoryOptions: {
            lastMessages: 5,
            semanticRecall: {
              topK: 2,
              messageRange: 1,
            },
          },
        },
      ),
      totalTimeout,
      composeTimeout,
      templateTimeout,
      sendTimeout,
    ]);

    console.log("📬 Agent response received");

    // Process the response and handle memory updates
    const cleanResponse = processMemoryUpdates(response.text);
    console.log("📝 Email sending result:", cleanResponse);
  } catch (error) {
    console.error("❌ Error in email process:", error);

    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    // Log environment variable status (without showing the actual values)
    console.log("🔍 Environment variables status:", {
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      RESEND_DEFAULT_SENDER: !!process.env.RESEND_DEFAULT_SENDER,
    });
  }
};

// Run the example
console.log("📋 Starting email sending example...");
sendEmail()
  .then(() => console.log("✨ Email sending example completed"))
  .catch((error) => console.error("💥 Unhandled error:", error));
