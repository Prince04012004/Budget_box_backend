import express from "express";
import connectDB from "./config/db.js";
import authroutes from "./routes/authroutes.js";
import addexpenseRouter from "./routes/expenseroutes.js";
import cors from "cors";

const port = process.env.PORT || 3000; 

const app = express();

app.use(cors());
app.use(express.json()); 

connectDB();

app.use('/api', authroutes);
app.use('/api', addexpenseRouter);

app.get("/", (req, res) => {
  res.send("BudgetBox Backend is Running!");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});