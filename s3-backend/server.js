import express from 'express';
import mongoose from 'mongoose';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import connectDB from './db.js';
import cors from 'cors';
import Product from './product-model.js';


dotenv.config();

const app = express();
const PORT = 5000;

// Initialize S3 Client
const client = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
});


// Middleware to parse JSON
app.use(express.json());
app.use(cors( 
    {
        origin: '*', // Allow all origins (you can specify your frontend URL here)
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
        allowedHeaders: ['Content-Type'], // Allow these headers
    }
))


const createPresignedUrlWithClient = ({ bucket, key, contentType }) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};


// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to the S3 Learning Backend!');
});

app.post('/api/get-presigned-url', async (req, res) => {
    const { mime } = req.body;
    const ext = mime.split('/')[1];          // "image/jpeg" → "jpeg"
    const filename = uuidv4();
    const fileName = `${filename}.${ext}`;   // "uuid.jpeg"

  // Logic to generate a presigned URL for S3 upload
    const url = await createPresignedUrlWithClient({
        bucket: process.env.AWS_BUCKET_NAME,
        key: fileName,
        contentType: mime,
    });

    res.json({ url, filename: fileName });
});

app.post('/api/products', async (req, res) => {
    const { productName, description, imageName, price } = req.body;

    if(!productName || !description || !imageName || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newProduct = new Product({
        productName,
        description,
        imageName,
        price
    });

    await newProduct.save();

    res.json({ message: 'Product created successfully', product: { productName, description, imageName, price } });

});

// Start the server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
}
);
