import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Otp from "../model/Otp.js";
import { sendmail } from "../utils/sendemail.js";
import env from "dotenv";
env.config();

//Signup

export const signup = async (req, res) => {
  try {
    const { name, email, password, monthlyincome, otp } = req.body;

    const userexist=await User.findOne({email});
    if(userexist){
        return res.status(400).json({
            message:"User already exist"
        })
    }

    const otprecord = await Otp.findOne({ email });

    if (!otprecord || otprecord.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        message: "Invalid OTP or Expired OTP",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedpassword = await bcrypt.hash(password, salt);

    const income = Number(monthlyincome);
    const dailyincome = income / 30;

    const newUser = await User.create({
      name,
      email,
      password: hashedpassword,
      monthlyincome: income,

      dailybudget: {
        food: dailyincome * 0.4,
        travelling: dailyincome * 0.4,
        others: dailyincome * 0.2,
      },
    });
    await Otp.deleteOne({ email });

    // 5. Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//sendotp

export const sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const Userexist = await User.findOne({ email });
    if (Userexist) {
      return res.status(400).json({
        message: "User already exist",
      });
    }
    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);

    //save otp
    await Otp.findOneAndUpdate(
      { email },
      { otp },
      {
        upsert: true,
        new: true,
      },
    );
    //send otp to email
    await sendmail(email, otp);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP.Please try again",
    });
  }
};

//Login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
     return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    // 3. Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "Login sucessfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
