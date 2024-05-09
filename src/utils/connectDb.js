import mongoose from "mongoose";

const connectDb = () => {
  mongoose
    .connect(process.env.MONGODB)
    .then(() => console.log("Connected to DB"))
    .catch((err) => {
      console.error(err);
    });
}

export default connectDb