import { S3Client, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'AWS_BUCKET_NAME',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
      'Please make sure these are set in your .env file'
  );
}

export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

export const countS3Files = async () => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: 'lectures/'
        });

        const response = await s3Client.send(command);
        return response.Contents?.length || 0;
    } catch (error) {
        console.error('Error counting files in S3: ', error);
    }
}

export const s3Storage = multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: async function (req, file, cb) {
        try {
            const fileCount = await countS3Files();
            const FILE_LIMIT = 100;

            if(fileCount >= FILE_LIMIT) {
                cb(new Error('Storage limit reached'));
                return;
            }

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, 'lectures/' + uniqueSuffix + '-' + file.originalname);
        } catch (error) {
            cb(error);
        }
    }
});

export const deleteFileFromS3 = async (fileKey) => {
    try {
        await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey
        }));
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        throw error;
    }
};

export const getFileFromS3 = async (fileKey) => {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey
        });
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return signedUrl;
    } catch (error) {
        console.error("Error generating signed url: ", error);
        throw error;
    }
}