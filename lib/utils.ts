import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import QRCode from "qrcode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateQrCodeBlobUrl(text: string): Promise<string> {
  try {
    const hostname = process.env.NODE_ENV === "production" ? "https://junr-gallery.vercel.app" : "http://localhost:3000";
    // Generate QR code as a data URL (base64 encoded image)
    const dataUrl = await QRCode.toDataURL(`${hostname}${text}`);

    // Convert the data URL to a Blob
    const blob = await fetch(dataUrl).then((res) => res.blob());

    // Create a Blob URL
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}
