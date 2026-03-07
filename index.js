import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authroutes from "./routes/authroutes.js";
import addexpenseRouter from "./routes/expenseroutes.js";
import { budgetreset } from "./Cron/budgetreset.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// Database connect
connectDB();

// Cron job
budgetreset();

// Routes
app.use("/api", authroutes);
app.use("/api", addexpenseRouter);

// Test route
app.get("/", (req, res) => {
  res.send("BudgetBox Backend is Running!");
});

// Server start
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});