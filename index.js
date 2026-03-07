import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authroutes from "./routes/authroutes.js";
import addexpenseRouter from "./routes/expenseroutes.js";
import { budgetreset } from "./Cron/budgetreset.js";

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Database and Cron
connectDB();
budgetreset();

// Routes
app.use('/api', authroutes);
app.use('/api', addexpenseRouter);

app.get("/", (req, res) => {
  res.send("BudgetBox Backend is Running!");
});

// Server Start
app.listen(port, "0.0.0.0", () => {
  console.log(`App is running on port ${port}`);
});