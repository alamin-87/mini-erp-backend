import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export const uploadFileToCloudinary = async (
  fileBuffer: Buffer,
  filename: string,
  mimeType: string = "image/jpeg"
) => {
  const result = await cloudinary.uploader.upload(
    `data:${mimeType};base64,${fileBuffer.toString("base64")}`,
    {
      public_id: `${Date.now()}-${filename.replace(/\.[^.]+$/, "")}`,
      folder: "mini-erp/products",
      resource_type: "image",
    }
  );

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

export const deleteFileFromCloudinary = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};