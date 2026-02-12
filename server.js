 import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import { connectDB } from './db_config/db.js';
import Userrouter from './routers/Users.router.js';
import Adminrouter from './routers/Admin.router.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://cozy-unicorn-220ee0.netlify.app" ,"https://mern-practice-frontnend.vercel.app"],
  credentials: true
}));

app.use(express.json());
app.use("/api/users", Userrouter);
app.use("/api/admins", Adminrouter);

const PORT = process.env.PORT || 8000;

// Fix: Connect DB before starting server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('DB connection failed:', err);
  process.exit(1);
});
