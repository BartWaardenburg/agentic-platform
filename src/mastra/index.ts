import { Mastra } from "@mastra/core/mastra";
import { emailAgent } from "./agents/emailAgent";
import { messageComposerAgent } from "./agents/messageComposerAgent";
import { emailTemplateAgent } from "./agents/emailTemplateAgent";
import { supervisorEmailAgent } from "./agents/supervisorEmailAgent";

export const mastra = new Mastra({
  agents: {
    emailAgent,
    messageComposerAgent,
    emailTemplateAgent,
    supervisorEmailAgent,
  },
});
