// backend/routes/doctorRoutes.js

const express = require('express');
const router = express.Router();
const healthMonitor = require('../services/healthMonitor');


router.post('/health/:patientId', healthMonitor.postSingleHealthData);
router.put('/health/:patientId', healthMonitor.updatePatientHealthData);
router.post('/health/:patientId/multiple', healthMonitor.postMultipleHealthData);
const { aggregateHealthData } = require('../services/healthDataAggregator');

// Route to manually trigger health data aggregation
router.post('/aggregate-health-data', async (req, res) => {
    try {
        const startDate = new Date('2024-08-27T14:41:00Z'); // One week ago in UTC
        const endDate = new Date('2024-09-03T14:41:00Z'); // Now in UTC

        // Run the weekly aggregation with the specified date range
        await aggregateHealthData('weekly', startDate, endDate);
        res.status(200).json({ message: 'One-week aggregation triggered successfully' });
    } catch (err) {
        console.error('Error triggering aggregation:', err);
        res.status(500).json({ error: 'Failed to trigger aggregation' });
    }
});


module.exports = router;
