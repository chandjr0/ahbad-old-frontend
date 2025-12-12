import { resolveImageUrl } from "./imageUrl";

// Re-export resolveImageUrl for convenience
export { resolveImageUrl };

/**
 * Gets the best available product image with fallback priority
 * Priority order:
 * 1. galleryImage[0] (first non-empty)
 * 2. image (string or array[0])
 * 3. thumbImage
 * 4. images[0] (first non-empty)
 * 5. placeholder
 * 
 * @param {object} product - Product object
 * @returns {string} - Resolved image URL
 */
export const getProductImage = (product) => {
  if (!product) {
    return "/image/placeholder_600x.webp";
  }

  // Priority 1: galleryImage array (first non-empty)
  if (product?.galleryImage && Array.isArray(product.galleryImage)) {
    const firstImage = product.galleryImage.find(img => img && img !== "");
    if (firstImage) {
      return resolveImageUrl(firstImage);
    }
  }

  // Priority 2: image field (could be string or array)
  if (product?.image) {
    if (Array.isArray(product.image)) {
      const firstImage = product.image.find(img => img && img !== "");
      if (firstImage) {
        return resolveImageUrl(firstImage);
      }
    } else if (typeof product.image === "string" && product.image !== "") {
      return resolveImageUrl(product.image);
    }
  }

  // Priority 3: thumbImage
  if (product?.thumbImage && product.thumbImage !== "") {
    return resolveImageUrl(product.thumbImage);
  }

  // Priority 4: images array (first non-empty)
  if (product?.images && Array.isArray(product.images)) {
    const firstImage = product.images.find(img => img && img !== "");
    if (firstImage) {
      return resolveImageUrl(firstImage);
    }
  }

  // Priority 5: placeholder
  return "/image/placeholder_600x.webp";
};

