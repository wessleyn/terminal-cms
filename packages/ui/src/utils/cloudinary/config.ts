// Import cloudinary with TypeScript types
import { v2 as cloudinary } from 'cloudinary';

// TypeScript interface for configuration
interface CloudinaryConfig {
  cloud_name?: string;
  api_key?: string;
  api_secret?: string;
  secure?: boolean;
}

// Return "https" URLs by setting secure: true
const config: CloudinaryConfig = {
  secure: true,
  // cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(config);

// Type for the resources response
interface CloudinaryResourceApiResponse {
  resources: Array<Record<string, any>>;
  rate_limit_allowed?: number;
  rate_limit_remaining?: number;
  rate_limit_reset_at?: string;
}

async function test(): Promise<void> {
  try {
    const result: CloudinaryResourceApiResponse = await cloudinary.api.resources();
    console.log(result);
  } catch (error) {
    console.error('Cloudinary API Error:', error);
  }
}

test();

// Export the configured cloudinary instance for use elsewhere
export default cloudinary;