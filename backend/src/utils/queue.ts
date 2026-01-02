import Queue from 'bull';
import { config } from '../config/env.js';

// Create a queue for sending poll results
export const pollResultsQueue = new Queue('poll-results', {
  redis: {
    host: config.redis?.host || 'localhost',
    port: config.redis?.port || 6379,
  }
});

console.log('✓ Poll results queue initialized');
