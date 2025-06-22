const mongoose = require('mongoose');

const casePracticeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    caseId: {
      type: String,
      required: true, // e.g., "water-purifier", "market-entry"
    },
    caseTitle: {
      type: String,
      required: true, // e.g., "Water Purifier"
    },
    caseDifficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    caseStatement: {
      type: String,
      required: true,
    },
    // Questions and Responses
    questionsAndResponses: [
      {
        questionNumber: { type: Number, required: true },
        userQuestion: { type: String, required: true },
        aiResponse: { type: String },
        feedback: {
          rating: { type: String, enum: ['Critical', 'Good', 'Excellent'] },
          relevance: { type: String },
          depth: { type: String },
          constructiveFeedback: { type: String },
        },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    // Framework Tab Data
    framework: {
      submitted: { type: Boolean, default: false },
      content: { type: String }, // User's framework submission
      submittedAt: { type: Date },
    },
    // Review Tab Data (Performance Metrics)
    performanceMetrics: {
      overallRating: { type: Number, min: 0, max: 10, default: 0 },
      structure: { type: Number, min: 0, max: 10, default: 0 },
      problemFormulation: { type: Number, min: 0, max: 10, default: 0 },
      communication: { type: Number, min: 0, max: 10, default: 0 },
      confidence: { type: Number, min: 0, max: 10, default: 0 },
      questionsAsked: { type: Number, default: 0 },
      excellentQuestions: { type: Number, default: 0 },
      timeTaken: { type: String }, // e.g., "1m 49s"
      frameworkSubmitted: { type: Boolean, default: false },
    },
    // Areas for Improvement
    areasForImprovement: [
      {
        category: { type: String }, // e.g., "Structure", "Problem Formulation"
        feedback: { type: String },
      },
    ],
    // Session Status
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
    // Timestamps
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    totalTimeSpent: { type: Number }, // in seconds
  },
  {
    timestamps: true,
  }
);

const CasePractice = mongoose.model('CasePractice', casePracticeSchema);
module.exports = CasePractice;
