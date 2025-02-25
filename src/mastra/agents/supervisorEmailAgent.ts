import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { DefaultStorage } from "@mastra/core/storage";
import {
  composeMessageTool,
  createTemplateTool,
  sendEmailTool,
} from "../tools/email";

/* Types for agent events */
type GenerateInput = {
  text: string;
};

type GenerateOutput = {
  text: string;
};

/* Configure memory with working memory and semantic search */
const memory = new Memory({
  storage: new DefaultStorage({
    config: {
      url: "file:memory.db",
    },
  }),
  options: {
    // Keep track of recent messages for context
    lastMessages: 10,

    // Enable semantic search to find relevant past emails
    semanticRecall: {
      topK: 3, // Find 3 most relevant past messages
      messageRange: 2, // Include 2 messages before and after for context
    },

    // Enable working memory to store email preferences and statistics
    workingMemory: {
      enabled: true,
      template: `
        <email_context>
          <!-- Store user email preferences -->
          <preferences>
            <default_tone>professional</default_tone>
            <signature></signature>
            <style>
              <primary_color></primary_color>
              <font_family></font_family>
            </style>
          </preferences>
          
          <!-- Track email statistics -->
          <statistics>
            <emails_sent>0</emails_sent>
            <last_email_sent></last_email_sent>
            <common_recipients>
              <!-- Format: <recipient email="example@test.com" count="1" /> -->
            </common_recipients>
          </statistics>
          
          <!-- Store recent email templates for reuse -->
          <recent_templates>
            <!-- Format: <template id="template_1" name="Welcome Email" last_used="timestamp" /> -->
          </recent_templates>
        </email_context>
      `,
    },
  },
});

/* Create the supervisor agent */
export const supervisorEmailAgent = new Agent({
  name: "Email Supervisor",
  instructions: `
    ROLE DEFINITION:
    You are a supervisor agent that orchestrates the entire email creation and sending process.
    You coordinate between three specialized agents:
    1. Message Composer - Creates the initial email content
    2. Template Creator - Converts the content into a responsive HTML template
    3. Email Sender - Handles the final email delivery

    PROCESS FLOW:
    1. Receive email request with recipient, subject, and any style preferences
    2. Call Message Composer to create the initial content
    3. Pass content to Template Creator for HTML formatting
    4. Send the final HTML email using the Email Sender
    5. Return success/failure status

    BEHAVIORAL GUIDELINES:
    - Ensure smooth coordination between all agents
    - Maintain consistent tone and style throughout the process
    - Handle errors gracefully at each step
    - Provide clear feedback about the process status
    - Log each step of the process for debugging purposes
    
    MEMORY MANAGEMENT:
    - Store user email preferences in working memory
    - Track email statistics and update after each send
    - Remember commonly used templates and recipients
    - Use semantic search to find similar past emails when relevant
    - Update working memory after each successful email send
    
    WORKING MEMORY UPDATES:
    When you need to update working memory, use this format:
    1. First provide your normal response to the user
    2. Then add "MEMORY_UPDATE:" on a new line
    3. Then add your working memory XML update
    
    Example:
    Your email has been sent successfully!
    MEMORY_UPDATE:
    <working_memory>...</working_memory>

    This ensures the working memory updates are separate from your response to the user.
  `,
  model: openai("gpt-4o-mini"),
  memory,
  tools: {
    composeMessageTool,
    createTemplateTool,
    sendEmailTool,
  },
});
