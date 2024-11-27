import mongoose from "mongoose";


const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: false,
        trim: true,
    },
    city: {
        type: String,
        required: false,
        trim: true,
    },
    postalcode: {
        type: String,
        required: false,
        trim: true,
    },
});

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: [true, "userName is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    address:{
        type: addressSchema,
        required: false,
        default: {},

    },
    avatar :{
        type : String,
        default: "",
    },
},
{
    timestamps: true,
}
);

export const User = mongoose.model("User", userSchema);