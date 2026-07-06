import multer from "multer";

const memoryStorage = multer.memoryStorage();
export const multerMemoryUpload = multer({ storage: memoryStorage });
