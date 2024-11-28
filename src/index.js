import dotenv from "dotenv";
import connectDB from "./config/index.js";
import {app} from "./app.js";




dotenv.config({
});



connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log("server is running at port ", process.env.PORT);
    })
})
.catch((err) => {
    console.log("mongodb connection error", err);
    
})

























/* import express from "express";
const app = express();

;(async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_COLLECTION_NAME}`);
        app.on("error", (err) => {
            console.log("db coonection error", err);
        });

        app.listen(process.env.PORT, () => {
            console.log("app is listening is on port", process.env.PORT);
        })
    } catch (error) {
        console.log("Error", error);
        throw error;
    }
})()*/