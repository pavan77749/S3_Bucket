import express from 'express';
import mongoose from 'mongoose';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = 5000;

// Initialize S3 Client
const client = new S3Client({ region: 'ap-south-1' , credentials: {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}});


// Middleware to parse JSON
app.use(express.json());

const createPresignedUrlWithClient = ({ bucket, key }) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};


// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to the S3 Learning Backend!');
});

app.post('/api/get-presigned-url', async (req, res) => {
    const { mime } = req.body;
    const filename = uuidv4(); // Generate a unique filename using UUID
    const fileName = `${filename}.${mime}`; // Use the MIME type to determine the file extension

  // Logic to generate a presigned URL for S3 upload
    const url = await createPresignedUrlWithClient({
        bucket: process.env.AWS_BUCKET_NAME,
        key: fileName // Use the MIME type to determine the file extension
    });

    res.json({ url : url, filename: fileName });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}
);
