import InterviewSession from '../models/InterviewSession.js';
import { generateAnswerFeedback } from '../services/answerFeedbackGenerator.js';
import { generateInterviewQuestions } from '../services/questionGenerator.js';

function toSessionResponse(session) {
  return {
    id: session._id.toString(),
    resumeFileName: session.resumeFileName,
    jobDescription: session.jobDescription,
    questions: session.questions,
    questionSource: session.questionSource,
    answers: session.answers,
    createdAt: session.createdAt,
  };
}

export async function createInterviewSession(req, res) {
  const { resumeFileName, jobDescription } = req.body;

  if (!resumeFileName || !jobDescription) {
    return res.status(400).json({ message: 'Resume filename and job description are required.' });
  }

  if (jobDescription.trim().length < 20) {
    return res.status(400).json({ message: 'Job description must be at least 20 characters.' });
  }

  const { questions, source } = await generateInterviewQuestions({
    resumeFileName,
    jobDescription,
  });

  const session = await InterviewSession.create({
    user: req.user.id,
    resumeFileName,
    jobDescription,
    questions,
    questionSource: source,
  });

  return res.status(201).json({ session: toSessionResponse(session) });
}

export async function listInterviewSessions(req, res) {
  const sessions = await InterviewSession.find({ user: req.user.id }).sort({ createdAt: -1 });

  return res.json({
    sessions: sessions.map(toSessionResponse),
  });
}

export async function createAnswerFeedback(req, res) {
  const { sessionId } = req.params;
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ message: 'Question and answer are required.' });
  }

  if (answer.trim().length < 20) {
    return res.status(400).json({ message: 'Answer must be at least 20 characters.' });
  }

  const session = await InterviewSession.findOne({
    _id: sessionId,
    user: req.user.id,
  });

  if (!session) {
    return res.status(404).json({ message: 'Interview session not found.' });
  }

  const feedback = await generateAnswerFeedback({
    question,
    answer,
    jobDescription: session.jobDescription,
  });

  const answerFeedback = {
    question,
    answer,
    confidenceScore: feedback.confidenceScore,
    strengths: feedback.strengths,
    improvements: feedback.improvements,
    suggestedAnswer: feedback.suggestedAnswer,
    toneFeedback: feedback.toneFeedback,
    feedbackSource: feedback.source,
  };

  session.answers.push(answerFeedback);
  await session.save();

  return res.status(201).json({
    feedback: session.answers[session.answers.length - 1],
  });
}
