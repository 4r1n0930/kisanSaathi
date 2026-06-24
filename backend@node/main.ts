import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase } from './src/config/database.config';
import authRoutes from './src/auth/auth.routes';
import farmerRoutes from './src/farmer/farmer.routes';
import traderRoutes from './src/trader/trader.routes';
import inspectorRoutes from './src/inspector/inspector.routes';
import uploadRoutes from './src/media/upload.controller';
import voiceRoutes from './src/voice/voice.routes';
import cropRoutes from './src/crops/crop.controller';
import bidRoutes from './src/bidding/bid.controller';
import marketRoutes from './src/market/market.controller';
import contractRoutes from './src/contracts/contract.controller';
import inspectionRoutes from './src/inspection/inspection.controller';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/media', uploadRoutes);
app.use('/farmers', farmerRoutes);
app.use('/traders', traderRoutes);
app.use('/inspectors', inspectorRoutes);
app.use('/voice', voiceRoutes);
app.use('/crops', cropRoutes);
app.use('/bid', bidRoutes);
app.use('/market', marketRoutes);
app.use('/contracts', contractRoutes);
app.use('/inspections', inspectionRoutes);

app.get('/', (_req, res) => res.json({ status: 'OK', message: 'KisanSaathi backend is running' }));

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

connectDatabase().finally(() => {
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
});
