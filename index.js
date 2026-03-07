import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authroutes from "./routes/authroutes.js";
import addexpenseRouter from "./routes/expenseroutes.js";
import { budgetreset } from "./Cron/budgetreset.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("BudgetBox Backend is Running!");
});

app.use("/api", authroutes);
app.use("/api", addexpenseRouter);

// Database connect
connectDB();

// Cron job
budgetreset();

// PORT (Render / cloud deploy ke liye important)
const PORT = process.env.PORT || 10000;

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});