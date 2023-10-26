import mongoose from "mongoose";

 export const connectMongoDB = async() => {
    if(mongoose.connections[0].readyState){
        return true
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        return true
        } catch (err) {
         console.log("Error connecting to database", err)
    }
}
 ;