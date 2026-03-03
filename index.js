import express from "express";
import connectDB from "./config/db.js";
import authroutes from "./routes/authroutes.js";
import addexpenseRouter  from "./routes/expenseroutes.js";
import cors from "cors";


const port = 3000;


const app = express();
app.use(cors());


// 1. Database connection
connectDB();

// 2. Middleware (MUST come before routes)
app.use(express.json()); 

// 3. Routes
app.use('/api', authroutes);
app.use('/api', addexpenseRouter)

app.get("/", (req, res) => {
  res.send("Hello ji");
  console.log("API is running");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});