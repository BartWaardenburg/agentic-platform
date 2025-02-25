import { describe, test, expect, beforeAll } from "vitest";
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { ToneConsistencyMetric } from "@mastra/evals/nlp";

// Check if required environment variables are set
const hasRequiredEnvVars =
  !!process.env.OPENAI_API_KEY &&
  !!process.env.MASTRA_API_KEY &&
  !!process.env.MASTRA_PROJECT_ID;

describe("Eval Example Tests", () => {
  // Create a simple test agent
  const testAgent = new Agent({
    name: "Test Agent",
    instructions:
      "You are a helpful assistant that maintains a consistent, friendly tone.",
    model: openai("gpt-4o-mini"),
  });

  // Skip tests if required environment variables are not set
  beforeAll(() => {
    if (!hasRequiredEnvVars) {
      console.warn(
        "Skipping tests: Required environment variables are not set.",
      );
    }
  });

  // Conditionally skip tests based on environment variables
  (hasRequiredEnvVars ? test : test.skip)(
    "should be able to validate tone consistency",
    async () => {
      // Generate a response
      const response = await testAgent.generate("Hello, world!");

      // Create and use the metric
      const metric = new ToneConsistencyMetric();
      const result = await metric.measure("Hello, world!", response.text);

      // Validate the result
      expect(result.score).toBeGreaterThanOrEqual(0);
    },
    10000, // 10 second timeout
  );

  (hasRequiredEnvVars ? test : test.skip)(
    "should handle complex inputs and maintain tone",
    async () => {
      // Generate a response for a more complex input
      const complexInput = "Can you explain quantum computing in simple terms?";
      const response = await testAgent.generate(complexInput);

      // Create and use the metric
      const metric = new ToneConsistencyMetric();
      const result = await metric.measure(complexInput, response.text);

      // Validate the result
      expect(result.score).toBeGreaterThanOrEqual(0.5);
      expect(result.info).toBeDefined();
    },
    15000, // 15 second timeout
  );
});
