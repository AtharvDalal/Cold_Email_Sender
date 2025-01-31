import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import EmailHistory from "@/models/EmailHistory";
import { connectDB } from "@/lib/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";

interface DecodedToken extends JwtPayload {
  userId: string;
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let userId: string | undefined;
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as DecodedToken;
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { fullname, phone, linkedinId, hrEmail, resume } = await req.json();

    if (!hrEmail) {
      return NextResponse.json(
        { message: "HR Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    let userFullname = fullname;
    if (!userFullname) {
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      userFullname = user.fullname; // Use fullname from database
    }

    console.log("Saving email history:", {
      userId,
      fullname: userFullname,
      hrEmail,
    });

    const emailHistory = new EmailHistory({
      userId,
      fullname: userFullname,
      hrEmail: hrEmail.toString(),
      sentAt: new Date(),
    });
    await emailHistory.save();

    console.log("Saved to DB:", emailHistory);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: hrEmail.toString(),
      subject: "Job Application",
      text: `
        Full Name: ${userFullname}
        Phone Number: ${phone}
        LinkedIn: ${linkedinId}
        Resume: ${resume ? resume : "No resume provided"}
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error: any) {
    console.error("Error in sending email:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
