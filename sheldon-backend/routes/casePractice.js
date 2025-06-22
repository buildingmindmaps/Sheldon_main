const express = require('express');
const {
  startCasePractice,
  addQuestionAndResponse,
  submitFramework,
  completeCasePractice,
  getCasePracticeHistory,
  getCasePracticeDetails,
} = require('../controllers/casePracticeController');
const { protect } = require('../middleware/auth');

const router = express.Router();
// Add this test route FIRST (before /:sessionId)
router.get('/test', (req, res) => {
  res.json({ message: 'CasePractice route is working!' });
});
// All routes are protected
router.post('/start', protect, startCasePractice);
router.put('/:sessionId/add-qa', protect, addQuestionAndResponse);
router.put('/:sessionId/submit-framework', protect, submitFramework);
router.put('/:sessionId/complete', protect, completeCasePractice);
router.get('/history', protect, getCasePracticeHistory);
router.get('/:sessionId', protect, getCasePracticeDetails);
router.get('/:sessionId', protect, getCasePracticeDetails);


module.exports = router;
