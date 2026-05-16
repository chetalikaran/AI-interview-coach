import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/connectDB.js';

dotenv.config();

const port = process.env.PORT || 5000;

try {
  await connectDB();

  app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
  });
} catch (error) {
  console.error(`Server startup failed: ${error.message}`);
  process.exit(1);
}
