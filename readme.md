#  S3 + CloudFront Image Upload Demo

This project demonstrates a modern, scalable workflow for uploading product images directly to **AWS S3**, serving them efficiently through **AWS CloudFront CDN**, using a **Next.js frontend** and **Node.js/Express backend**.

---

##  Features

- **Direct-to-S3 Uploads**
  - Images are uploaded directly from the browser to S3 using pre-signed URLs
  - Backend never handles file data (prevents memory bottlenecks)

- **CloudFront CDN Delivery**
  - Images are served through CloudFront instead of raw S3
  - Faster global delivery
  - Reduced S3 read latency
  - Improved caching & scalability

- **Secure Upload Flow**
  - Backend issues time-limited upload permission (Pre-signed URL)

- **Optimized Storage Strategy**
  - Only S3 object key (filename) is stored in MongoDB
  - CloudFront URL is generated dynamically when fetching products

---

##  System Architecture

###  Upload Flow
> 1. Frontend requests Pre-Signed URL  Backend returns URL & UUID
> 2. Frontend uploads file to S3 using Pre-Signed URL
> 3. Frontend sends metadata (Name, Price, UUID) to Backend  Saved to MongoDB

<img width="1063" height="673" alt="image" src="https://github.com/user-attachments/assets/cdaa20e5-57c5-4a5d-a444-bfddb4774fd9" />


###  Fetch Flow
> 1. Frontend requests products  Backend returns metadata
> 2. Frontend constructs image URL: `CloudFront_Domain + UUID`
> 3. User sees image served from CloudFront Edge Location

<img width="1041" height="611" alt="image" src="https://github.com/user-attachments/assets/e946bd1b-ae97-4ed5-a164-0c176f512415" />

---

##  Workflow Overview

### 1 Request Pre-Signed Upload URL
Frontend requests permission from backend to upload an image.
Backend generates:
- Unique filename (UUID)
- Time-limited S3 upload URL

**API Call:** `POST /api/get-presigned-url`

**Request Body:**
```json
{
  "mime": "image/jpeg"
}
```

**Response:**
```json
{
  "url": "https://s3.ap-south-1.amazonaws.com/bucket-name/uuid.jpgSignature=...",
  "filename": "uuid.jpg"
}
```

---

### 2 Upload Image Directly to S3
Frontend uploads image directly to AWS S3 using the pre-signed URL.
Backend is **NOT** involved in this step.

**API Call:** `PUT {presigned-url}`

**Headers:**
`Content-Type: image/jpeg`

**Benefits:**
- Faster uploads
- No backend memory usage
- Better scalability

---

### 3 Create Product Entry
After successful upload, frontend sends product details to backend.

**API Call:** `POST /api/products`

**Request Body:**
```json
{
  "productName": "Laptop",
  "description": "Gaming Laptop",
  "price": 50000,
  "imageName": "uuid-image.jpg"
}
```

**Backend Action:**
Stores metadata in MongoDB:
```json
{
  "productName": "Laptop",
  "description": "Gaming Laptop",
  "price": 50000,
  "imageName": "uuid-image.jpg"
}
```

---

##  Fetching Products with CloudFront Images

When fetching products, the backend dynamically constructs the image URL using the CloudFront domain.

**Logic:**
```javascript
const imageUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${imageName}`;
```

**Example Result:**
`https://d12345abcdef.cloudfront.net/uuid-image.jpg`

---

##  API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/get-presigned-url` | Returns time-limited S3 upload URL |
| `PUT` | `{presigned-url}` | Upload image directly to S3 (Frontend only) |
| `POST` | `/api/products` | Creates product entry in MongoDB |
| `GET` | `/api/products` | Returns product list with CloudFront image URLs |

---

##  Environment Variables

Configure these in `s3-backend/.env`:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=ap-south-1

MONGODB_URI=mongodb+srv://...

CLOUDFRONT_URL=https://d12345abcdef.cloudfront.net
```

---

##  Folder Structure

```
s3-backend/
  +-- server.js           # Express App
  +-- product-model.js    # Mongoose Schema
  +-- db.js              # Database Connection
  +-- .env               # Secrets

s3-frontend/
  +-- src/app/create/page.js  # Upload Form Logic
  +-- ...
```

---

##  License
MIT
