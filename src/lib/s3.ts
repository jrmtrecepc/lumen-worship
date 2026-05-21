import { S3Client } from '@aws-sdk/client-s3';

// Backblaze B2 S3-Compatible credentials
const endpoint = import.meta.env.VITE_S3_ENDPOINT || ''; // e.g., s3.us-west-004.backblazeb2.com
const region = import.meta.env.VITE_S3_REGION || 'us-west-004';
const accessKeyId = import.meta.env.VITE_S3_ACCESS_KEY_ID || '';
const secretAccessKey = import.meta.env.VITE_S3_SECRET_ACCESS_KEY || '';

export const s3 = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true, // Required for B2
});

export const BUKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME || '';
