// utils/digitalocean.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import path from "path";
import {
    DO_SPACES_ENDPOINT,
    DO_SPACES_KEY,
    DO_SPACES_SECRET,
    DO_SPACES_BUCKET,
    DO_SPACES_CDN,
} from "../constants";

// Validate DigitalOcean Spaces configuration
const validateSpacesConfig = () => {
    const requiredVars = {
        DO_SPACES_ENDPOINT,
        DO_SPACES_KEY,
        DO_SPACES_SECRET,
        DO_SPACES_BUCKET,
        DO_SPACES_CDN,
    };

    const missing = Object.entries(requiredVars)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

    if (missing.length > 0) {
        throw new Error(
            `Missing required DigitalOcean Spaces environment variables: ${missing.join(", ")}. ` +
            `Please set these in your .env file.`
        );
    }

    return requiredVars as {
        DO_SPACES_ENDPOINT: string;
        DO_SPACES_KEY: string;
        DO_SPACES_SECRET: string;
        DO_SPACES_BUCKET: string;
        DO_SPACES_CDN: string;
    };
};

// Initialize S3 client with validated credentials
let s3: S3Client | null = null;

const getS3Client = (): S3Client => {
    if (!s3) {
        const config = validateSpacesConfig();
        s3 = new S3Client({
            region: "us-east-1", // DO uses nyc3, sgp1, etc., but AWS SDK requires region
            endpoint: config.DO_SPACES_ENDPOINT,
            credentials: {
                accessKeyId: config.DO_SPACES_KEY,
                secretAccessKey: config.DO_SPACES_SECRET,
            }
        });
    }
    return s3;
};

export const uploadVoiceToSpaces = async (file: Express.Multer.File): Promise<string> => {
    try {
        const config = validateSpacesConfig();
        const client = getS3Client();
        const extension = path.extname(file.originalname);
        const filename = `voices/${uuid()}${extension}`;

        await client.send(
            new PutObjectCommand({
                Bucket: config.DO_SPACES_BUCKET,
                Key: filename,
                Body: file.buffer,
                ACL: "public-read",
                ContentType: file.mimetype,
            })
        );

        return `${config.DO_SPACES_CDN}/${filename}`;
    } catch (error: any) {
        if (error.message.includes("Missing required DigitalOcean Spaces")) {
            throw error;
        }
        throw new Error(
            `Failed to upload file to DigitalOcean Spaces: ${error.message}. ` +
            `Please check your credentials and configuration.`
        );
    }
};
