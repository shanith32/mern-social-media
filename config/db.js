import mongoose from "mongoose";
import config from "config";
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true
    });

    console.log("MongoDB Connnected...");
  } catch (err) {
    console.error(err.message);
    // Exit on failure
    process.exit(1);
  }
};

export default connectDB;
