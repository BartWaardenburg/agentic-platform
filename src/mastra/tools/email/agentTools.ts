import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { messageComposerAgent } from "../../agents/messageComposerAgent";
import { emailTemplateAgent } from "../../agents/emailTemplateAgent";
import { emailAgent } from "../../agents/emailAgent";

/**
 * Tool for composing email messages using the message composer agent
 */
export const composeMessageTool = createTool({
  id: "compose-message",
  description: "Calls the message composer agent to write the email content",
  inputSchema: z.object({
    subject: z.string().describe("Email subject"),
    tone: z.enum(["formal", "casual", "friendly", "professional"]).optional(),
    targetAudience: z.string().optional(),
    keyPoints: z.array(z.string()).optional(),
  }),
  outputSchema: z.object({
    content: z.string(),
  }),
  execute: async ({ context }) => {
    console.log("🔄 [ComposeMessage] Starting to compose email message...");
    console.log("📝 [ComposeMessage] Input:", {
      subject: context.subject,
      tone: context.tone || "professional",
      targetAudience: context.targetAudience,
      keyPoints: context.keyPoints,
    });

    try {
      const result = await messageComposerAgent.generate(
        `Create an email message about: ${context.subject}. Use a ${context.tone || "professional"} tone.`,
      );
      console.log("✅ [ComposeMessage] Successfully composed message");
      return { content: result.text };
    } catch (error) {
      console.error("❌ [ComposeMessage] Error composing message:", error);
      throw error;
    }
  },
});

/**
 * Tool for creating HTML email templates using the template agent
 */
export const createTemplateTool = createTool({
  id: "create-template",
  description: "Calls the email template agent to create HTML email template",
  inputSchema: z.object({
    message: z.string(),
    style: z
      .object({
        primaryColor: z
          .string()
          .optional()
          .describe("Primary brand color (must be email-safe)"),
        secondaryColor: z
          .string()
          .optional()
          .describe("Secondary brand color (must be email-safe)"),
        fontFamily: z.string().optional().describe("Email-safe font stack"),
        customClasses: z
          .record(z.string())
          .optional()
          .describe("Optional custom CSS classes"),
        autoStyle: z
          .boolean()
          .optional()
          .describe("Flag to enable creative styling by the agent"),
      })
      .optional()
      .describe(
        "Optional style configuration - if not provided, agent will create a creative style",
      ),
    template: z
      .object({
        headerImage: z.string().optional().describe("Header image URL"),
        footer: z.string().optional().describe("Footer content"),
        socialLinks: z
          .object({
            twitter: z.string().optional(),
            linkedin: z.string().optional(),
            facebook: z.string().optional(),
          })
          .optional()
          .describe("Social media links"),
      })
      .optional()
      .describe("Optional template configuration"),
  }),
  outputSchema: z.object({
    html: z.string(),
  }),
  execute: async ({ context }) => {
    console.log("🔄 [CreateTemplate] Starting to create HTML template...");
    console.log("📝 [CreateTemplate] Input:", {
      messageLength: context.message.length,
      style: context.style,
      template: context.template,
    });

    try {
      let prompt = `Convert this message into a responsive HTML email template: ${context.message}`;

      // Add styling instructions if provided
      if (context.style) {
        prompt += "\n\nStyle configuration:";
        if (context.style.primaryColor)
          prompt += `\nPrimary color: ${context.style.primaryColor}`;
        if (context.style.secondaryColor)
          prompt += `\nSecondary color: ${context.style.secondaryColor}`;
        if (context.style.fontFamily)
          prompt += `\nFont family: ${context.style.fontFamily}`;
        if (context.style.autoStyle)
          prompt +=
            "\nPlease use creative styling while incorporating any provided style elements.";
      } else {
        // If no style is provided, explicitly request creative styling
        prompt +=
          "\n\nPlease use your creative judgment to design an appealing template that matches the content and purpose of this email.";
      }

      // Add template configuration if provided
      if (context.template) {
        prompt += "\n\nTemplate configuration:";
        if (context.template.headerImage)
          prompt += `\nHeader image URL: ${context.template.headerImage}`;
        if (context.template.footer)
          prompt += `\nFooter content: ${context.template.footer}`;
        if (context.template.socialLinks) {
          prompt += "\nSocial links:";
          if (context.template.socialLinks.twitter)
            prompt += `\n- Twitter: ${context.template.socialLinks.twitter}`;
          if (context.template.socialLinks.linkedin)
            prompt += `\n- LinkedIn: ${context.template.socialLinks.linkedin}`;
          if (context.template.socialLinks.facebook)
            prompt += `\n- Facebook: ${context.template.socialLinks.facebook}`;
        }
      }

      const result = await emailTemplateAgent.generate(prompt);
      console.log("✅ [CreateTemplate] Successfully created HTML template");
      return { html: result.text };
    } catch (error) {
      console.error("❌ [CreateTemplate] Error creating template:", error);
      throw error;
    }
  },
});

/**
 * Tool for sending emails using the email agent
 */
export const sendEmailTool = createTool({
  id: "send-email",
  description: "Calls the email agent to send the final email",
  inputSchema: z.object({
    to: z.string(),
    subject: z.string(),
    html: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    console.log("🔄 [SendEmail] Starting to send email...");
    console.log("📝 [SendEmail] Input:", {
      to: context.to,
      subject: context.subject,
      htmlLength: context.html.length,
    });

    try {
      const result = await emailAgent.generate(
        `Send this email:
        To: ${context.to}
        Subject: ${context.subject}
        Content: ${context.html}`,
      );
      console.log("✅ [SendEmail] Email agent response received");

      const success = !result.text.includes("error");
      console.log(
        success
          ? "✅ [SendEmail] Email sent successfully"
          : "❌ [SendEmail] Failed to send email",
      );

      // Process the response to filter out memory updates
      let cleanMessage = result.text;

      // Filter out memory update sections completely
      if (cleanMessage.includes("MEMORY_UPDATE")) {
        // Find the index where MEMORY_UPDATE starts
        const memoryUpdateIndex = cleanMessage.indexOf("MEMORY_UPDATE");
        if (memoryUpdateIndex > 0) {
          // Only keep the text before MEMORY_UPDATE
          cleanMessage = cleanMessage.substring(0, memoryUpdateIndex).trim();

          // Remove any trailing quotes that might be left
          cleanMessage = cleanMessage.replace(/["']+$/, "").trim();
        }
      }

      // Log memory updates for debugging but don't return to user
      if (result.text.includes("MEMORY_UPDATE")) {
        const memoryUpdatePart = result.text.substring(
          result.text.indexOf("MEMORY_UPDATE"),
        );
        console.log("📝 [SendEmail] Memory updated:", memoryUpdatePart);
      }

      return {
        success,
        message: cleanMessage,
      };
    } catch (error) {
      console.error("❌ [SendEmail] Error sending email:", error);
      throw error;
    }
  },
});
