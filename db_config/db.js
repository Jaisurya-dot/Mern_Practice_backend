import dns from "node:dns";
dns.setServers(['8.8.8.8', '1.1.1.1']); // Forces Node.js to use public DNS

import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error); 
        process.exit(1); 
    }   
};
   