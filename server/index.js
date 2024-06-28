import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

import userRoute from "./route/user.route.js";

dotenv.config();

const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoute);

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post('/api/upload', upload.single('file'), async (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);

    try {
        // Upload file to Google Drive
        const response = await drive.files.create({
            requestBody: {
                name: req.file.originalname,
                mimeType: req.file.mimetype,
            },
            media: {
                mimeType: req.file.mimetype,
                body: fs.createReadStream(filePath),
            },
        });

        const fileId = response.data.id; // Extract the file ID from the response

        // Set file permission to public
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Get public URL for the file
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink',
        });

        // Log or return the public URL
        console.log('Public URL:', result.data.webViewLink);
        // console.log('Public URL:', result.data.webContentLink);

        // Delete local file
        fs.unlinkSync(filePath);

        res.status(200).json({ fileName: req.file.originalname, publicUrl: result.data.webViewLink });
    } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB Connection Successful");
    })
    .catch((err) => {
        console.log(err.message);
    });

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
});

