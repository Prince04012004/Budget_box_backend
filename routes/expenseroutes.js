import express from "express"
import { addexpense, dashbaord, deleteexpense, getexpensses, updateexpense,checkgraph,getSingleExpense, getusercount ,updatemonthlyincome} from "../controllers/expensecontroller.js"
import authmiddlewares from "../middlewares/authmiddleware.js";
import { get } from "mongoose";

const expenseRoutes=express.Router();

expenseRoutes.post("/addexpense",authmiddlewares,addexpense)
expenseRoutes.get("/getexpenses",authmiddlewares,getexpensses)
expenseRoutes.get("/getexpenses/:id", authmiddlewares, getSingleExpense);
expenseRoutes.delete("/deleteexpense/:id",authmiddlewares,deleteexpense)
expenseRoutes.put("/updateexpense/:id",authmiddlewares,updateexpense)
expenseRoutes.get("/dashboard",authmiddlewares,dashbaord);
expenseRoutes.get("/checkgraph",authmiddlewares,checkgraph);
expenseRoutes.get("/getusercount",authmiddlewares,getusercount);
expenseRoutes.put("/updatemonthlyincome",authmiddlewares,updatemonthlyincome);

export default expenseRoutes;