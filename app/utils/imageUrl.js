import { imageBasePath } from "@/config";

/**
 * Resolves image URL from database path to full URL
 * Handles various path formats from CSV import:
 * - "public/product/abc.jpg" => "http://localhost:7074/public/product/abc.jpg"
 * - "/public/product/abc.jpg" => "http://localhost:7074/public/product/abc.jpg"
 * - "product/abc.jpg" => "http://localhost:7074/public/product/abc.jpg"
 * - Already absolute URLs => return as-is
 * 
 * @param {string|null|undefined} path - Image path from database
 * @returns {string} - Full URL or placeholder path
 */
export const resolveImageUrl = (path) => {
  // Return placeholder if path is falsy
  if (!path || path === "" || path === null || path === undefined) {
    return "/image/placeholder_600x.webp";
  }

  // If already absolute URL, return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Normalize path - ensure it starts with /public
  let normalizedPath = path.trim();

  // Remove leading slash if present for consistent processing
  if (normalizedPath.startsWith("/")) {
    normalizedPath = normalizedPath.substring(1);
  }

  // Handle different path formats
  if (normalizedPath.startsWith("public/")) {
    // Already has public/ prefix
    normalizedPath = normalizedPath;
  } else if (normalizedPath.startsWith("product/")) {
    // Add public/ prefix
    normalizedPath = `public/${normalizedPath}`;
  } else {
    // Assume it's already a public path or needs public/ prefix
    // Try to be smart - if it doesn't start with public, add it
    if (!normalizedPath.startsWith("public/")) {
      normalizedPath = `public/${normalizedPath}`;
    }
  }

  // Ensure leading slash for URL construction
  if (!normalizedPath.startsWith("/")) {
    normalizedPath = `/${normalizedPath}`;
  }

  // Remove double slashes
  normalizedPath = normalizedPath.replace(/\/+/g, "/");

  // Construct full URL
  return `${imageBasePath}${normalizedPath}`;
};


