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

    console.log('[START_CASE] New case practice session created:', casePractice._id); // Log the new session ID
    res.status(201).json({
      success: true,
      data: casePractice,
      message: 'Case practice session started successfully',
    });
  } catch (error) {
    console.error('Error starting case practice:', error);
    // Log specific Mongoose validation errors
    if (error.name === 'ValidationError') {
        console.error('Mongoose Validation Error Details:', error.errors);
        return res.status(400).json({
            message: 'Validation failed for starting case practice',
            errors: error.errors,
            rawError: error.message
        });
    }
    res.status(500).json({ message: 'Error starting case practice session', error: error.message });
  }
};

// @desc    Add question and response to case practice session
// @route   PUT /api/case-practice/:sessionId/add-qa
// @access  Private
const addQuestionAndResponse = async (req, res) => {
  const { sessionId } = req.params;
  const { questionNumber, userQuestion, aiResponse, feedback } = req.body;
  console.log('--- Add Q&A Controller ---');
  console.log('Session ID:', sessionId);
  console.log('Request Body:', JSON.stringify(req.body, null, 2)); // Stringify for better logging of nested objects
  console.log('User ID from token:', req.user._id);

  try {
    const casePractice = await CasePractice.findOne({
      _id: sessionId,
      userId: req.user._id,
    });

    console.log('Found case practice session:', casePractice ? 'YES' : 'NO');
    if (!casePractice) {
      console.warn(`[ADD_QA] Session ${sessionId} not found or unauthorized for user ${req.user._id}`);
      return res.status(404).json({ message: 'Case practice session not found or unauthorized' });
    }

    // [FIX] Map frontend feedback rating to backend schema enum to prevent validation errors.
    const mapRatingToSchema = (rating) => {
      const lowerCaseRating = rating?.toLowerCase();
      switch (lowerCaseRating) {
        case 'excellent':
          return 'Excellent';
        case 'critical':
          return 'Critical';
        case 'satisfactory':
        case 'needs-improvement':
          return 'Good'; // Map both to 'Good'
        default:
          return 'Good'; // Default value if something unexpected is passed
      }
    };

    const formattedFeedback = {
      ...feedback,
      rating: mapRatingToSchema(feedback.rating),
    };

    casePractice.questionsAndResponses.push({
      questionNumber,
      userQuestion,
      aiResponse,
      feedback: formattedFeedback,
      timestamp: new Date()
    });

    await casePractice.save();
    console.log('[ADD_QA] Session saved successfully!');
    res.json({
      success: true,
      data: casePractice,
      message: 'Question and response added successfully',
    });
  } catch (error) {
    console.error('--- Error in Add Q&A Controller ---');
    console.error('Error adding Q&A:', error);
    // Log specific Mongoose validation errors
    if (error.name === 'ValidationError') {
        console.error('Mongoose Validation Error Details:', error.errors);
        return res.status(400).json({
            message: 'Validation failed for adding question and response',
            errors: error.errors,
            rawError: error.message
        });
    }
    res.status(500).json({
      message: 'Error adding question and response',
      error: error.message
    });
  }
};

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
      { new: true, runValidators: true } // Add runValidators for update operations
    );

    if (!casePractice) {
      console.warn(`[SUBMIT_FRAMEWORK] Session ${sessionId} not found or unauthorized for user ${req.user._id}`);
      return res.status(404).json({ message: 'Case practice session not found or unauthorized' });
    }

    console.log('[SUBMIT_FRAMEWORK] Framework submitted successfully for session:', casePractice._id);
    res.json({
      success: true,
      data: casePractice,
      message: 'Framework submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting framework:', error);
    if (error.name === 'ValidationError') {
        console.error('Mongoose Validation Error Details:', error.errors);
        return res.status(400).json({
            message: 'Validation failed for framework submission',
            errors: error.errors,
            rawError: error.message
        });
    }
    res.status(500).json({ message: 'Error submitting framework', error: error.message });
  }
};

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
      { new: true, runValidators: true } // Add runValidators
    );

    if (!casePractice) {
      console.warn(`[COMPLETE_CASE] Session ${sessionId} not found or unauthorized for user ${req.user._id}`);
      return res.status(404).json({ message: 'Case practice session not found or unauthorized' });
    }

    console.log('[COMPLETE_CASE] Case practice session completed:', casePractice._id);
    res.json({
      success: true,
      data: casePractice,
      message: 'Case practice session completed successfully',
    });
  } catch (error) {
    console.error('Error completing case practice:', error);
    if (error.name === 'ValidationError') {
        console.error('Mongoose Validation Error Details:', error.errors);
        return res.status(400).json({
            message: 'Validation failed for completing case',
            errors: error.errors,
            rawError: error.message
        });
    }
    res.status(500).json({ message: 'Error completing case practice session', error: error.message });
  }
};

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
    res.status(500).json({ message: 'Error fetching case practice history', error: error.message });
  }
};

const getCasePracticeDetails = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const casePractice = await CasePractice.findOne({
      _id: sessionId,
      userId: req.user._id,
    });

    if (!casePractice) {
      console.warn(`[GET_DETAILS] Session ${sessionId} not found or unauthorized for user ${req.user._id}`);
      return res.status(404).json({ message: 'Case practice session not found or unauthorized' });
    }

    res.json({
      success: true,
      data: casePractice,
    });
  } catch (error) {
    console.error('Error fetching case practice details:', error);
    res.status(500).json({ message: 'Error fetching case practice details', error: error.message });
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
