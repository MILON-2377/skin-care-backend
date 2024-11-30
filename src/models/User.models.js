import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import nodemailer from "nodemailer";


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
    postalCode: {
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
    password:{
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    address:{
        type: addressSchema,
        default: {},
    },
    phone:{
        type: String,
        required: false,
        trim: true,
    },
    avatar :{
        type : String,
        default: "",
    },
    refreshToken:{
        type: String,
    },
    twoFactorSecret:{
        type: String,
        default: null
    },
    isTwoFactorEnabled:{
        type: Boolean,
        default: false,
    }
},
{
    timestamps: true,
}
);


userSchema.pre('save', async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});


userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}



// userSchema.methods.qrCodeSend = function(email){

//     // generate secret
//     const secret = speakeasy.generateSecret({
//         name:`${process.env.DB_COLLECTION_NAME}`
//     });

//     this.twoFactorSecret = secret;


//     // generate the qr code url for the user to scan
//     const qrCodeUrl = nodemailer.createTransport({
//         service:"gmail",
//         auth:{
//             user: email,
//             pass:'milon',
//         }
//     });

//     // create the email content with the qr code image embedded
//     const mailOptions = {
//         from:"milon.sheikh.msk@gmail.com"
//     }

// }

export const User = mongoose.model("User", userSchema);