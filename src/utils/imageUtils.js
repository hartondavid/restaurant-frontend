/**
 * Utility functions for handling images in the application
 */

/**
 * Get the full image URL with API base URL
 * @param {string} imagePath - The relative path to the image
 * @returns {string} The full image URL
 */
export const getImageUrl = (imagePath) => {
    // In development, return the local path
    if (process.env.NODE_ENV === 'development') {
        return imagePath || '/no-image.svg';
    }

    if (!imagePath) {
        return '/no-image.svg';
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
        return imagePath;
    }

    // If it starts with /, it's already a relative path from the API
    if (imagePath.startsWith('/')) {
        return `${process.env.REACT_APP_API_URL}${imagePath}`;
    }

    // Otherwise, construct the full URL
    return `${process.env.REACT_APP_API_URL}/${imagePath}`;
};

/**
 * Handle image load errors
 * @param {Event} e - The error event
 * @param {string} originalSrc - The original image source that failed
 */
export const handleImageError = (e, originalSrc) => {
    console.error('Image failed to load:', originalSrc);
    e.target.src = '/no-image.svg';
};

/**
 * Check if the API URL is properly configured
 * @returns {boolean} True if API URL is configured
 */
export const isApiUrlConfigured = () => {
    return !!process.env.REACT_APP_API_URL;
};

/**
 * Get a debug message for image loading issues
 * @param {string} imagePath - The image path that failed
 * @returns {string} Debug message
 */
export const getImageDebugMessage = (imagePath) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    return `Image loading failed. API URL: ${apiUrl || 'NOT SET'}, Image Path: ${imagePath}`;
};

/**
 * Check if we're in development environment
 * @returns {boolean} True if in development
 */
export const isDevelopment = () => {
    return process.env.NODE_ENV === 'development';
};

/**
 * Get the appropriate image source based on environment
 * @param {string} imagePath - The image path
 * @returns {string} The image source URL
 */
export const getImageSource = (imagePath) => {
    if (isDevelopment()) {
        return imagePath || '/no-image.svg';
    }
    return getImageUrl(imagePath);
}; 