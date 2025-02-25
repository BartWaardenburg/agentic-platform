import { createTool } from "@mastra/core/tools";
import { Resend } from "resend";
import { z } from "zod";

/* Default sender email configuration */
const DEFAULT_SENDER = process.env.RESEND_DEFAULT_SENDER;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

/* Types for email configuration and parameters */
interface EmailConfig {
  defaultParams?: Partial<SendEmailParams>;
}

interface SendEmailParams {
  to: string;
  from: string;
  subject: string;
  html: string;
  apiKey: string;
}

/**
 * Creates and configures the email tool with default parameters
 * @param {EmailConfig} config - Configuration options including default parameters
 * @returns The configured email tool
 */
const createEmailTool = ({ defaultParams = {} }: EmailConfig = {}) =>
  createTool({
    id: "send-email",
    description: "Sends an email using Resend service",
    inputSchema: z.object({
      to: z.string(),
      subject: z.string(),
      html: z.any(),
    }),
    outputSchema: z.object({
      id: z.string(),
      errorMessage: z.string().optional(),
    }),
    execute: async ({ context }) => {
      const params = { ...defaultParams, ...context };
      const resend = new Resend(RESEND_API_KEY);

      try {
        const response = await resend.emails.send({
          from: DEFAULT_SENDER ?? "",
          to: params.to,
          subject: params.subject,
          html: params.html,
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        return {
          id: response.data?.id || "",
        };
      } catch (error) {
        return {
          id: "",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error occurred",
        };
      }
    },
  });

export const emailTool = createEmailTool();

export {
  composeMessageTool,
  createTemplateTool,
  sendEmailTool,
} from "./agentTools";
