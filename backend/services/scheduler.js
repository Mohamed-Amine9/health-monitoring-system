// backend/services/scheduler.js

const cron = require('node-cron');
const { aggregateHealthData } = require('./healthDataAggregator');

// Helper function to calculate start and end times for each interval
const calculateTimeRange = (interval) => {
    const now = new Date();
    let startDate;
    
    switch (interval) {
        case 'hourly':
            startDate = new Date(now.setHours(now.getHours() - 1));
            break;
        case 'halfDay':
            startDate = new Date(now.setHours(now.getHours() - 12));
            break;
        case 'daily':
            startDate = new Date(now.setDate(now.getDate() - 1));
            break;
        case 'weekly':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'monthly':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        default:
            throw new Error('Invalid interval');
    }

    return { startDate, endDate: new Date() };
};

// Schedule tasks at specific intervals
const scheduleAggregations = () => {
    // Hourly aggregation
    cron.schedule('0 * * * *', async () => {
        const { startDate, endDate } = calculateTimeRange('hourly');
        await aggregateHealthData('hourly', startDate, endDate);
    });

    // Half-day aggregation
    cron.schedule('0 */12 * * *', async () => {
        const { startDate, endDate } = calculateTimeRange('halfDay');
        await aggregateHealthData('halfDay', startDate, endDate);
    });

    // Daily aggregation
    cron.schedule('0 0 * * *', async () => {
        const { startDate, endDate } = calculateTimeRange('daily');
        await aggregateHealthData('daily', startDate, endDate);
    });

    // Weekly aggregation
    cron.schedule('0 0 * * 0', async () => {
        const { startDate, endDate } = calculateTimeRange('weekly');
        await aggregateHealthData('weekly', startDate, endDate);
    });

    // Monthly aggregation
    cron.schedule('0 0 1 * *', async () => {
        const { startDate, endDate } = calculateTimeRange('monthly');
        await aggregateHealthData('monthly', startDate, endDate);
    });

    console.log('Health data aggregation schedules set up.');
};

module.exports = { scheduleAggregations };
