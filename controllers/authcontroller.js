import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from "dotenv";
env.config();


//Signup

export const signup=async(req,res)=>{

   try{
    
    
    const{name,email,password,monthlyincome,selectedtune}=req.body;
    

    const user=await User.findOne({email});

    if(user){
      return  res.status(400).json({
            message:"User already exist"
        })
    }

    //hashing the password

    const hashedpassword= await bcrypt.hash(password,10);

   

    //calculate dailyincome
     
    const dailyincome=monthlyincome/30;

   

    const newUser=await User.create({
        name,
        email,
        password:hashedpassword,
        monthlyincome,
      
        dailybudget:{
            food:dailyincome*0.4,
            travelling:dailyincome*0.4,
            others:dailyincome*0.2
        },
        selectedtune
        
    })

     // 5. Generate JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    
    res.status(201).json({
        message:"User registered successfully",
        token,
        newUser
    })




   }
   catch(error){
    res.status(500).json({
        message:error.message
    
    })
   }





}

//Login

export const login=async(req,res)=>{

    try{

        const {email,password}=req.body

        const user=await User.findOne({email})

        if(!user){
            res.status(400).json({
                message:"Invalid credentials"
            })
        }

        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
             return res.status(400).json({
                message:"Invalid credentials"
            })
        }
    // 3. Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
        message:"Login sucessfully",
        token
    })

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }





}

