import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB(); // Connect to MongoDB

    const body = await req.json();
    console.log("✅ Request Body:", body);

    if (!body || typeof body !== "object") {
      console.log("❌ Body is missing or invalid");
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { username, password } = body;
    console.log("✅ Parsed username:", username);
    console.log("✅ Parsed password:", password);

    if (!username || !password) {
      console.log("❌ Username or password is missing");
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("❌ User already exists:", existingUser);
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = new User({ username, password });
    console.log("✅ New User Object Before Save:", newUser);

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
