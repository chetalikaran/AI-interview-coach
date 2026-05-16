import OpenAI from 'openai';

function buildMockFeedback(answer) {
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  const confidenceScore = Math.min(88, Math.max(45, wordCount * 3));

  return {
    confidenceScore,
    strengths: [
      'You gave a direct answer instead of avoiding the question.',
      'Your response has enough context to become a stronger interview story.',
    ],
    improvements: [
      'Add a specific result or measurable outcome.',
      'Structure the answer with situation, action, and result.',
    ],
    suggestedAnswer:
      'A stronger answer would briefly explain the situation, describe your specific contribution, and end with the result or lesson learned.',
    toneFeedback: 'Your tone is clear. Make it more confident by using active language and fewer uncertain phrases.',
    source: 'mock',
  };
}

function parseFeedbackFromText(text) {
  const parsed = JSON.parse(text);

  return {
    confidenceScore: Number(parsed.confidenceScore),
    strengths: parsed.strengths,
    improvements: parsed.improvements,
    suggestedAnswer: parsed.suggestedAnswer,
    toneFeedback: parsed.toneFeedback,
    source: 'openai',
  };
}

export async function generateAnswerFeedback({ question, answer, jobDescription }) {
  if (!process.env.OPENAI_API_KEY) {
    return buildMockFeedback(answer);
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-5.2',
    input: [
      {
        role: 'system',
        content:
          'You are an interview confidence coach. Give practical, encouraging, specific feedback on candidate answers.',
      },
      {
        role: 'user',
        content: [
          `Job description: ${jobDescription}`,
          `Interview question: ${question}`,
          `Candidate answer: ${answer}`,
          'Evaluate the answer for clarity, confidence, relevance, and structure.',
        ].join('\n\n'),
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'answer_feedback',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            confidenceScore: {
              type: 'number',
              minimum: 0,
              maximum: 100,
            },
            strengths: {
              type: 'array',
              minItems: 2,
              maxItems: 3,
              items: { type: 'string' },
            },
            improvements: {
              type: 'array',
              minItems: 2,
              maxItems: 3,
              items: { type: 'string' },
            },
            suggestedAnswer: {
              type: 'string',
            },
            toneFeedback: {
              type: 'string',
            },
          },
          required: ['confidenceScore', 'strengths', 'improvements', 'suggestedAnswer', 'toneFeedback'],
          additionalProperties: false,
        },
      },
    },
  });

  return parseFeedbackFromText(response.output_text);
}
