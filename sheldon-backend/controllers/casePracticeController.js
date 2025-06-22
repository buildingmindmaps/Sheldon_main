const CasePractice = require('../models/CasePractice');

// @desc    Start a new case practice session
// @route   POST /api/case-practice/start
// @access  Private
const startCasePractice = async (req, res) => {
  const { caseId, caseTitle, caseDifficulty, caseStatement } = req.body;

  try {
    const casePractice = await CasePractice.create({
      userId: req.user._id,
      caseId,
      caseTitle,
      caseDifficulty,
      caseStatement,
    });

    res.status(201).json({
      success: true,
      data: casePractice,
      message: 'Case practice session started successfully',
    });
  } catch (error) {
    console.error('Error starting case practice:', error);
    res.status(500).json({ message: 'Error starting case practice session' });
  }
};

// @desc    Add question and response to case practice session
// @route   PUT /api/case-practice/:sessionId/add-qa
// @access  Private
const addQuestionAndResponse = async (req, res) => {
  const { sessionId } = req.params;
  const { questionNumber, userQuestion, aiResponse, feedback } = req.body;

  try {
    const casePractice = await CasePractice.findOne({
      _id: sessionId,
      userId: req.user._id,
    });

    if (!casePractice) {
      return res.status(404).json({ message: 'Case practice session not found' });
    }

    casePractice.questionsAndResponses.push({
      questionNumber,
      userQuestion,
      aiResponse,
      feedback,
    });

    await casePractice.save();

    res.json({
      success: true,
      data: casePractice,
      message: 'Question and response added successfully',
    });
  } catch (error) {
    console.error('Error adding Q&A:', error);
    res.status(500).json({ message: 'Error adding question and response' });
  }
};

// @desc    Submit framework for case practice session
// @route   PUT /api/case-practice/:sessionId/submit-framework
// @access  Private
const submitFramework = async (req, res) => {
  const { sessionId } = req.params;
  const { frameworkContent } = req.body;

  try {
    const casePractice = await CasePractice.findOneAndUpdate(
      { _id: sessionId, userId: req.user._id },
      {
        'framework.submitted': true,
        'framework.content': frameworkContent,
        'framework.submittedAt': new Date(),
        'performanceMetrics.frameworkSubmitted': true,
      },
      { new: true }
    );

    if (!casePractice) {
      return res.status(404).json({ message: 'Case practice session not found' });
    }

    res.json({
      success: true,
      data: casePractice,
      message: 'Framework submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting framework:', error);
    res.status(500).json({ message: 'Error submitting framework' });
  }
};

// @desc    Complete case practice session with performance metrics
// @route   PUT /api/case-practice/:sessionId/complete
// @access  Private
const completeCasePractice = async (req, res) => {
  const { sessionId } = req.params;
  const { performanceMetrics, areasForImprovement, totalTimeSpent } = req.body;

  try {
    const casePractice = await CasePractice.findOneAndUpdate(
      { _id: sessionId, userId: req.user._id },
      {
        status: 'completed',
        completedAt: new Date(),
        performanceMetrics,
        areasForImprovement,
        totalTimeSpent,
      },
      { new: true }
    );

    if (!casePractice) {
      return res.status(404).json({ message: 'Case practice session not found' });
    }

    res.json({
      success: true,
      data: casePractice,
      message: 'Case practice session completed successfully',
    });
  } catch (error) {
    console.error('Error completing case practice:', error);
    res.status(500).json({ message: 'Error completing case practice session' });
  }
};

// @desc    Get user's case practice history
// @route   GET /api/case-practice/history
// @access  Private
const getCasePracticeHistory = async (req, res) => {
  try {
    const casePractices = await CasePractice.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-questionsAndResponses'); // Exclude detailed Q&A for history view

    res.json({
      success: true,
      data: casePractices,
      count: casePractices.length,
    });
  } catch (error) {
    console.error('Error fetching case practice history:', error);
    res.status(500).json({ message: 'Error fetching case practice history' });
  }
};

// @desc    Get specific case practice session details
// @route   GET /api/case-practice/:sessionId
// @access  Private
const getCasePracticeDetails = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const casePractice = await CasePractice.findOne({
      _id: sessionId,
      userId: req.user._id,
    });

    if (!casePractice) {
      return res.status(404).json({ message: 'Case practice session not found' });
    }

    res.json({
      success: true,
      data: casePractice,
    });
  } catch (error) {
    console.error('Error fetching case practice details:', error);
    res.status(500).json({ message: 'Error fetching case practice details' });
  }
};

module.exports = {
  startCasePractice,
  addQuestionAndResponse,
  submitFramework,
  completeCasePractice,
  getCasePracticeHistory,
  getCasePracticeDetails,
};
