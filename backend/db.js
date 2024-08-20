import mongoose from "mongoose";

import Dotenv from 'dotenv'

Dotenv.config();

const connectDB = async()=>{
    try {
        const connectionInstances =   await mongoose.connect(`${process.env.MONGO_URI}/ScriptStorm`)  
     
        console.log(`\n MONGODB Connected !! DB host : ${connectionInstances.connection.host}`);
         } catch (error) {
             console.error("MONGODB Connection Error : ",error)
     
             process.exit(1);
         }
}
export default connectDB