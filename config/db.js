import mongoose from "mongoose";

 const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://shokinkhan244_db_user:SHAUKEEN%40123@cluster0.yghlfzd.mongodb.net/food-delivery').then(()=>console.log("DB connected"));
}

export default connectDB;


// import mongoose from "mongoose";
// import dotenv from "dotenv";


// dotenv.config()


// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.error("MongoDB connection failed:", error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;