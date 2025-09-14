const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController.jsx');
const eventsController = require('../controllers/eventsController.jsx');

// assignment: returns variant for user in experiment
router.post('/assign', assignmentController.assignVariant);

// kill switch control
router.post('/kill/:experimentId', assignmentController.setKillSwitch);
router.get('/kill/:experimentId', assignmentController.getKillSwitchStatus);

// events
router.post('/events', eventsController.logEvent);

module.exports = router;
