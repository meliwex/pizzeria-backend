import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    default: "client",
    enums: ["client"]
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true 
  },
  phone: {
    type: String,
    required: true,
    unique: true 
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}, { timestamps: true });


export default mongoose.model("User", userSchema);