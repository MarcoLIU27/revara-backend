import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.router';
import profileRouter from './routes/profile.router';
import propertiesRouter from './routes/properties.router';
import contractsRouter from './routes/contracts.router';
import cashbuyersRouter from './routes/cashbuyers.router';
import { notFoundHandler } from './middleware/not-found';
import { errorHandler } from './middleware/error-handler';
import cookieParser from 'cookie-parser';
import requestLogger from './middleware/requestLogger';
import { pino } from "pino";
dotenv.config();

export const logger = pino({ name: "server start" });
const PORT = parseInt(process.env.PORT || "6000", 10);

const app = express();

// CORS Middleware
const allowedOrigins = [
  'http://localhost:8080',
  'https://preview--revara.lovable.app',
  'https://revara.lovable.app',
  process.env.ORIGIN
].filter(Boolean);

const corsOptions = {
  origin: function (origin: string | undefined, callback: (arg0: Error | null, arg1: boolean | undefined) => void) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  console.log('CORS passed:', req.method, req.path);
  next();
});

// JSON Middleware & Form Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

// Request Logger
app.use(requestLogger)

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Main Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/properties', propertiesRouter);
app.use('/api/contracts', contractsRouter);
app.use('/api/cashbuyers', cashbuyersRouter);
// Not Found Middleware
app.use(notFoundHandler);

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on http://localhost:6000');
});
