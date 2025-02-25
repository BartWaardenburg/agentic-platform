import { openai } from "@ai-sdk/openai";
import {
  AnswerRelevancyMetric,
  BiasMetric,
  ToxicityMetric,
  PromptAlignmentMetric,
} from "@mastra/evals/llm";
import {
  ContentSimilarityMetric,
  KeywordCoverageMetric,
  ToneConsistencyMetric,
} from "@mastra/evals/nlp";
import { evaluate, Metric } from "@mastra/core/eval";
import { Agent } from "@mastra/core/agent";

/**
 * Sets up the evaluation environment
 */
export const setupEvalEnv = async () => {
  // Initialize any environment setup needed for evaluations
  // This could include setting up API keys, configuring metrics, etc.
  console.log("Setting up evaluation environment...");
};

/**
 * Creates evaluation metrics with the specified configuration
 * @param {Object} options - Configuration options for the metrics
 * @param {number} options.scale - Scale for the metrics (default: 5)
 * @param {string[]} options.customContext - Custom context for the metrics
 * @returns {Object} - Object containing the configured metrics
 */
export const createEvalMetrics = ({
  scale = 5,
  customContext = [],
}: {
  scale?: number;
  customContext?: string[];
}) => {
  // Create a model instance for the metrics
  const model = openai("gpt-4o-mini");

  return {
    // LLM-based metrics
    answerRelevancy: new AnswerRelevancyMetric(model, { scale }),
    bias: new BiasMetric(model, { scale }),
    toxicity: new ToxicityMetric(model, { scale }),
    promptAlignment: (instructions: string[]) =>
      new PromptAlignmentMetric(model, { instructions, scale }),

    // NLP-based metrics
    contentSimilarity: new ContentSimilarityMetric({
      ignoreCase: true,
      ignoreWhitespace: true,
    }),
    keywordCoverage: new KeywordCoverageMetric(),
    toneConsistency: new ToneConsistencyMetric(),
  };
};

/**
 * Evaluates an agent's response using the specified metric
 * @param {Agent} agent - The agent to evaluate
 * @param {string} input - The input to the agent
 * @param {Metric} metric - The metric to use for evaluation
 * @returns {Promise<Object>} - The evaluation result
 */
export const evaluateAgentResponse = async (
  agent: Agent,
  input: string,
  metric: Metric
) => {
  // Generate a response from the agent
  const response = await agent.generate(input);
  const output = response.text;

  // Evaluate the response using the metric
  return await metric.measure(input, output);
};

/**
 * Runs a comprehensive evaluation of an agent using multiple metrics
 * @param {Agent} agent - The agent to evaluate
 * @param {string[]} testCases - Array of test inputs
 * @param {Record<string, Metric>} metrics - Object containing metrics to use
 * @returns {Promise<Object>} - Object containing evaluation results
 */
export const runComprehensiveEval = async (
  agent: Agent,
  testCases: string[],
  metrics: Record<string, Metric>
) => {
  const results: Record<string, Record<string, any>> = {};

  // Run each test case
  for (const testCase of testCases) {
    results[testCase] = {};

    // Generate a response
    const response = await agent.generate(testCase);
    const output = response.text;

    // Evaluate with each metric
    for (const [metricName, metric] of Object.entries(metrics)) {
      if (typeof metric.measure === "function") {
        results[testCase][metricName] = await metric.measure(testCase, output);
      }
    }
  }

  return results;
};
