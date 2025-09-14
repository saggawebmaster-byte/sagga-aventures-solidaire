import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({
    "application/pdf": { maxFileSize: "1MB", maxFileCount: 10 },
    "image/jpeg": { maxFileSize: "1MB", maxFileCount: 10 },
    "image/png": { maxFileSize: "1MB", maxFileCount: 10 },
    "application/msword": { maxFileSize: "1MB", maxFileCount: 10 },
    // "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "1MB", maxFileCount: 10 },
  })
    .middleware(async ({ req }) => {
      // Vous pouvez ajouter une authentification ici si nécessaire
      return { userId: "anonymous" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Log des informations d'upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      
      // Retourner des métadonnées supplémentaires si nécessaire
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;