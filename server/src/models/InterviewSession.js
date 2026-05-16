import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeFileName: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [String],
      default: [],
    },
    questionSource: {
      type: String,
      enum: ['mock', 'openai'],
      default: 'mock',
    },
    answers: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
        confidenceScore: {
          type: Number,
          min: 0,
          max: 100,
          required: true,
        },
        strengths: {
          type: [String],
          default: [],
        },
        improvements: {
          type: [String],
          default: [],
        },
        suggestedAnswer: {
          type: String,
          required: true,
        },
        toneFeedback: {
          type: String,
          required: true,
        },
        feedbackSource: {
          type: String,
          enum: ['mock', 'openai'],
          default: 'mock',
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

export default InterviewSession;
