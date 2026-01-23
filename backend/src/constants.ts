import { ElevenLabsClient } from "elevenlabs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const IS_TEST_MODE = false;

export const PORT = process.env.PORT as string;
export const FROM_EMIAL_ADDRESS = process.env.FROM_EMIAL_ADDRESS as string;
export const APP_PASSWORD = process.env.APP_PASSWORD as string;
export const EMAIL_HOST = process.env.EMAIL_HOST as string;
export const NODE_ENV = process.env.NODE_ENV as string;
export const MONGO_URI = process.env.MONGO_URI as string;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
export const RESET_PASSWORD_SECRET = process.env
  .RESET_PASSWORD_SECRET as string;
export const EMAIL_VERIFICATION_SECRET = process.env
  .EMAIL_VERIFICATION_SECRET as string;
export const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET as string;
// export const ACCESS_TOKEN_DURATION = 900; //15 minutes //TODO: to be opened after testing
export const ACCESS_TOKEN_DURATION = 259200; //3 days
export const REFRESH_TOKEN_DURATION = 604800; //7 days
export const ONE_WEEK_DURATION = 604800; //7 days
export const PROTOCOL_FEES = 0.0002; //0.2%
export const validExchanges = ["raydium", "jupiter"];
export const ADMIN_EMAIL = "umairamir@decryptedlabs.io"; // admin email

/**
 * Comma-separated list of frontend origins allowed to hit the API.
 * Falls back to common local dev ports plus the production domain.
 */
const FRONTEND_URL_ENV =
  process.env.FRONTEND_URL ||
  "https://ai-lama.vercel.app,http://localhost:3000,http://localhost:5173";

export const FRONTEND_URLS = FRONTEND_URL_ENV.split(",")
  .map((url) => url.trim())
  .filter(Boolean);

// Primary frontend URL for building links (first entry in the list)
export const FRONTEND_URL = FRONTEND_URLS[0];

export const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});