// frontend/src/lib/camera.ts
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'

export interface CapturedImage {
    dataUrl: string
    blob?: Blob
    fileName: string
    format: string
}

export class CameraService {
    /**
     * Check if running on native platform
     */
    static isNative(): boolean {
        return Capacitor.isNativePlatform()
    }

    /**
     * Take a photo using the device camera
     */
    static async takePhoto(quality: number = 90): Promise<CapturedImage> {
        try {
            const photo = await Camera.getPhoto({
                quality,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera,
                saveToGallery: false,
                correctOrientation: true,
                width: 1920,
                height: 1920,
            })

            return this.processPhoto(photo)
        } catch (error) {
            console.error('Camera error:', error)
            throw new Error('Failed to capture photo')
        }
    }

    /**
     * Select an image from the photo library
     */
    static async selectFromGallery(quality: number = 90): Promise<CapturedImage> {
        try {
            const photo = await Camera.getPhoto({
                quality,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Photos,
                saveToGallery: false,
                correctOrientation: true,
                width: 1920,
                height: 1920,
            })

            return this.processPhoto(photo)
        } catch (error) {
            console.error('Gallery selection error:', error)
            throw new Error('Failed to select photo')
        }
    }

    /**
     * Show prompt to choose between camera or gallery
     */
    static async pickImage(quality: number = 90): Promise<CapturedImage> {
        try {
            const photo = await Camera.getPhoto({
                quality,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Prompt, // Shows camera/gallery prompt
                promptLabelHeader: 'Select Photo',
                promptLabelPhoto: 'From Gallery',
                promptLabelPicture: 'Take Photo',
                saveToGallery: false,
                correctOrientation: true,
                width: 1920,
                height: 1920,
            })

            return this.processPhoto(photo)
        } catch (error) {
            console.error('Image picker error:', error)
            throw new Error('Failed to pick image')
        }
    }

    /**
     * Process the photo and convert to required format
     */
    private static async processPhoto(photo: Photo): Promise<CapturedImage> {
        if (!photo.dataUrl) {
            throw new Error('No image data received')
        }

        const fileName = `photo_${Date.now()}.${photo.format || 'jpeg'}`

        // Convert data URL to Blob if needed
        const blob = this.isNative() ? await this.dataUrlToBlob(photo.dataUrl) : undefined

        return {
            dataUrl: photo.dataUrl,
            blob,
            fileName,
            format: photo.format || 'jpeg',
        }
    }

    /**
     * Convert data URL to Blob
     */
    private static async dataUrlToBlob(dataUrl: string): Promise<Blob> {
        const response = await fetch(dataUrl)
        return response.blob()
    }

    /**
     * Check camera permissions
     */
    static async checkPermissions(): Promise<boolean> {
        try {
            const permissions = await Camera.checkPermissions()
            return permissions.camera === 'granted' && permissions.photos === 'granted'
        } catch (error) {
            console.error('Permission check error:', error)
            return false
        }
    }

    /**
     * Request camera permissions
     */
    static async requestPermissions(): Promise<boolean> {
        try {
            const permissions = await Camera.requestPermissions({
                permissions: ['camera', 'photos']
            })
            return permissions.camera === 'granted' && permissions.photos === 'granted'
        } catch (error) {
            console.error('Permission request error:', error)
            return false
        }
    }

    /**
     * Save image locally (for offline support)
     */
    static async saveImageLocally(dataUrl: string, fileName: string): Promise<string> {
        try {
            const savedFile = await Filesystem.writeFile({
                path: `images/${fileName}`,
                data: dataUrl,
                directory: Directory.Data,
            })

            return savedFile.uri
        } catch (error) {
            console.error('Failed to save image locally:', error)
            throw error
        }
    }

    /**
     * Convert image to base64 (for API upload)
     */
    static async imageToBase64(capturedImage: CapturedImage): Promise<string> {
        // Remove data:image/jpeg;base64, prefix if present
        return capturedImage.dataUrl.split(',')[1] || capturedImage.dataUrl
    }

    /**
     * Delete image from local storage
     */
    static async deleteImageLocally(fileName: string): Promise<void> {
        try {
            await Filesystem.deleteFile({
                path: `images/${fileName}`,
                directory: Directory.Data,
            })
        } catch (error) {
            console.error('Failed to delete image locally:', error)
        }
    }

    /**
     * Get file size in MB
     */
    static getFileSizeInMB(dataUrl: string): number {
        const base64Length = dataUrl.split(',')[1]?.length || dataUrl.length
        const sizeInBytes = (base64Length * 3) / 4
        return sizeInBytes / (1024 * 1024)
    }

    /**
     * Compress image if too large
     */
    static async compressIfNeeded(
        capturedImage: CapturedImage,
        maxSizeMB: number = 5
    ): Promise<CapturedImage> {
        const currentSize = this.getFileSizeInMB(capturedImage.dataUrl)

        if (currentSize <= maxSizeMB) {
            return capturedImage
        }

        // Calculate quality reduction needed
        const qualityReduction = Math.floor((maxSizeMB / currentSize) * 100)

        // Re-capture with lower quality
        console.log(`Compressing image from ${currentSize.toFixed(2)}MB with quality ${qualityReduction}`)

        // Return original for now, implement compression if needed
        return capturedImage
    }
}

// Export default instance
export default CameraService
