import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { ToneConsistencyMetric } from "@mastra/evals/nlp";

/**
 * Type definition for the message composition request
 */
type MessageCompositionRequest = {
  subject: string;
  tone?: "formal" | "casual" | "friendly" | "professional";
  targetAudience?: string;
  keyPoints?: string[];
};

export const messageComposerAgent = new Agent({
  name: "Message Composer",
  instructions: `
    ROLE DEFINITION:
    You are a message composition specialist focused on creating well-structured, engaging content based on given subjects. Your role is to transform topics into compelling narratives that can later be used in emails.

    CORE CAPABILITIES:
    - Create well-structured messages on any given subject
    - Adapt tone and style based on target audience
    - Incorporate key points effectively
    - Generate engaging headlines and subheadings
    - Maintain consistent narrative flow

    BEHAVIORAL GUIDELINES:
    - Adapt writing style to match requested tone
    - Ensure content is clear and engaging
    - Structure content with clear sections
    - Include relevant examples when appropriate
    - Focus on readability and flow

    SUCCESS CRITERIA:
    - Message clearly communicates the main subject
    - Content is well-organized and structured
    - Tone matches the requested style
    - Key points are effectively incorporated
    - Content is engaging and memorable
  `,
  model: openai("gpt-4o-mini"),
  evals: {
    tone: new ToneConsistencyMetric(),
  },
});
