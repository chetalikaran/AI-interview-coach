import OpenAI from 'openai';

const fallbackQuestions = [
  'Walk me through the most relevant project on your resume for this role.',
  'Tell me about a time you solved a difficult problem under pressure.',
  'What strengths would you bring to this position in your first 90 days?',
];

function buildMockQuestions(jobDescription) {
  const lowerCaseDescription = jobDescription.toLowerCase();
  const questions = [...fallbackQuestions];

  if (lowerCaseDescription.includes('react')) {
    questions.push('How have you structured React components in a project to keep the UI maintainable?');
  }

  if (lowerCaseDescription.includes('node') || lowerCaseDescription.includes('express')) {
    questions.push('How would you design a secure backend API for this product?');
  }

  if (lowerCaseDescription.includes('ai') || lowerCaseDescription.includes('openai')) {
    questions.push('How would you evaluate whether an AI-generated answer is helpful and reliable?');
  }

  return questions.slice(0, 5);
}

function parseQuestionsFromText(text) {
  const parsed = JSON.parse(text);

  if (!Array.isArray(parsed.questions)) {
    throw new Error('AI response did not include a questions array.');
  }

  return parsed.questions
    .filter((question) => typeof question === 'string')
    .map((question) => question.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export async function generateInterviewQuestions({ resumeFileName, jobDescription }) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      questions: buildMockQuestions(jobDescription),
      source: 'mock',
    };
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-5.2',
    input: [
      {
        role: 'system',
        content: 'You generate practical interview preparation questions for job candidates.',
      },
      {
        role: 'user',
        content: [
          `Resume file name: ${resumeFileName}`,
          `Job description: ${jobDescription}`,
          'Create five interview questions tailored to this resume and role.',
          'Mix technical, behavioral, and confidence-building questions.',
        ].join('\n\n'),
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'interview_questions',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              minItems: 5,
              maxItems: 5,
              items: {
                type: 'string',
              },
            },
          },
          required: ['questions'],
          additionalProperties: false,
        },
      },
    },
  });

  return {
    questions: parseQuestionsFromText(response.output_text),
    source: 'openai',
  };
}
