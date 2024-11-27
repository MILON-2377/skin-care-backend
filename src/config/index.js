import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connectioinInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_COLLECTION_NAME}`);
        console.log(`\n mongodb connected !!db host ${connectioinInstance.connection.host}`);

        // console.log(connectioinInstance);
        
    } catch (error) {
        console.log("mongodb connection error ", error);
        process.exit(1)
    }
}

export default connectDB;