import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Otp from "../models/Otp.js";
import Faculty from "../models/Faculty.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtp = async (req, res) => {
  try {
    console.log("===== sendOtp API called =====");
    console.log("Request Body:", req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email target is required.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    console.log("Email:", cleanEmail);

    const isAdmin = cleanEmail === "vinitk34128@gmail.com";

    if (!isAdmin) {
      const faculty = await Faculty.findOne({
        email: cleanEmail,
        isActive: true,
      });

      if (!faculty) {
        console.log("Faculty not found.");

        return res.status(404).json({
          success: false,
          message: "Access denied. Account not registered.",
        });
      }

      console.log("Faculty Found:", faculty.name);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", code);

    await Otp.findOneAndUpdate(
      { email: cleanEmail },
      { otp: code },
      { upsert: true, new: true }
    );

    const info = await transporter.sendMail({
      from: `"UniSmart Gatekeeper" <${process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: "Your Institutional Verification OTP",
      text: `Your login code is: ${code}. Valid for 5 minutes.`,
    });

    console.log("Email Sent Successfully:");
    console.log(info.response);

    return res.status(200).json({
      success: true,
      message: "One-time passcode dispatched.",
    });
  } catch (error) {
    console.error("========= EMAIL ERROR =========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const cleanEmail = email.toLowerCase().trim();

    const record = await Otp.findOne({
      email: cleanEmail,
      otp,
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired code.",
      });
    }

    await Otp.deleteOne({ _id: record._id });

    const isAdmin = cleanEmail === "vinitk34128@gmail.com";

    let userPayload = {
      email: cleanEmail,
      role: isAdmin ? "ADMIN" : "FACULTY",
      name: isAdmin ? "Super Admin" : "",
    };

    if (!isAdmin) {
      const faculty = await Faculty.findOne({
        email: cleanEmail,
      });

      if (faculty) {
        userPayload.id = faculty._id;
        userPayload.name = faculty.name;
      }
    }

    const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      token,
      user: userPayload,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Verification validation error.",
    });
  }
};