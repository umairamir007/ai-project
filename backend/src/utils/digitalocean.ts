// utils/digitalocean.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import path from "path";

const s3 = new S3Client({
    region: "us-east-1", // DO uses nyc3, sgp1, etc., but AWS SDK requires region
    endpoint: process.env.DO_SPACES_ENDPOINT, // e.g. "https://sgp1.digitaloceanspaces.com"
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY!,
        secretAccessKey: process.env.DO_SPACES_SECRET!,
    }
});

export const uploadVoiceToSpaces = async (file: Express.Multer.File) => {
    const extension = path.extname(file.originalname);
    const filename = `voices/${uuid()}${extension}`;

    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET!,
            Key: filename,
            Body: file.buffer,
            ACL: "public-read",
            ContentType: file.mimetype,
        })
    );

    return `${process.env.DO_SPACES_CDN}/${filename}`;
};
