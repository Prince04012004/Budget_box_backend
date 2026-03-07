import express from "express";
import connectDB from "./config/db.js";
import authroutes from "./routes/authroutes.js";
import addexpenseRouter from "./routes/expenseroutes.js";
import cors from "cors";
import { budgetreset } from "./Cron/budgetreset.js";

const port = process.env.PORT || 10000;

const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

connectDB();
budgetreset();

app.use('/api', authroutes);
app.use('/api', addexpenseRouter);

app.get("/", (req, res) => {
  res.send("BudgetBox Backend is Running!");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`App is running on port ${port}`);
});