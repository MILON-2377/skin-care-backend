import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();


const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;
const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    console.log("firebase admin sdk initialize successfully");
} catch (error) {
    console.log("firebase initialization error ", error.message);
}

export default admin;