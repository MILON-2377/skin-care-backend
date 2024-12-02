
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials:true,
    }
));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended: true, limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


// routes import
import userRouter from "./routes/user.routes.js";
import normalUserRouter from "./routes/normal.user.routes.js";
import orderRouter from "./routes/order.routes.js";
import productRouter from "./routes/products.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/normal-users", normalUserRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/product", productRouter);

export {app};