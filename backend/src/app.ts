import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.route.js';
import pollRoutes from './modules/polls/poll.route.js';
import voteRoutes from './modules/votes/vote.route.js';
import errorHandler from './middlewares/error.middleware.js';
import { config } from './config/env.js';

const app = express();

const allowedOrigins = config.allowedOrigins || ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Online Voting System API' });
});

app.use('/api/auth', authRoutes);     
app.use('/api/polls', pollRoutes);    
app.use('/api/votes', voteRoutes);    

// Error handler (must be last)
app.use(errorHandler);

export default app;
