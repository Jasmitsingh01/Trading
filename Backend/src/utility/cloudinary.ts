import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload image to Cloudinary
 * @param fileBuffer - File buffer from multipart upload
 * @param folder - Cloudinary folder name
 * @param publicId - Optional public ID for the image
 * @returns Cloudinary upload result with secure_url
 */
export const uploadToCloudinary = async (
    fileBuffer: Buffer,
    folder: string = 'BXTPRO',
    publicId?: string
): Promise<{ secure_url: string; public_id: string }> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: publicId,
                resource_type: 'auto',
                transformation: [
                    { width: 1000, height: 1000, crop: 'limit' },
                    { quality: 'auto:good' }
                ]
            },
            (error, result) => {
                if (error) {
                    console.error('❌ Cloudinary upload error:', error);
                    reject(new Error('Failed to upload image to Cloudinary'));
                } else if (result) {
                    console.log(`✅ Image uploaded to Cloudinary: ${result.secure_url}`);
                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id
                    });
                } else {
                    reject(new Error('Upload failed - no result returned'));
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};

/**
 * Upload avatar image with specific transformations
 */
export const uploadAvatar = async (
    fileBuffer: Buffer,
    userId: string
): Promise<string> => {
    const result = await uploadToCloudinary(
        fileBuffer,
        'BXTPRO/avatars',
        `avatar_${userId}_${Date.now()}`
    );
    return result.secure_url;
};

/**
 * Upload KYC document
 */
export const uploadKYCDocument = async (
    fileBuffer: Buffer,
    userId: string,
    documentType: string
): Promise<string> => {
    const result = await uploadToCloudinary(
        fileBuffer,
        `BXTPRO/kyc/${userId}`,
        `${documentType}_${Date.now()}`
    );
    return result.secure_url;
};

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Image deleted from Cloudinary: ${publicId}`);
    } catch (error) {
        console.error('❌ Error deleting from Cloudinary:', error);
        throw new Error('Failed to delete image from Cloudinary');
    }
};

export default cloudinary;
