import mongoose from "mongoose";

const MONGODB_URI =
  (process.env.MONGODB_URI as string) ||
  "mongodb+srv://sangamdalal24:sangam24@cluster0.lhpjvri.mongodb.net/emailsend?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env file");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};
