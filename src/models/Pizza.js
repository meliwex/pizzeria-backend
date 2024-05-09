import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true 
  },
  image: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    validate: v => Array.isArray(v) && v.length > 0,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  }
}, { timestamps: true });


export default mongoose.model("Pizza", pizzaSchema);