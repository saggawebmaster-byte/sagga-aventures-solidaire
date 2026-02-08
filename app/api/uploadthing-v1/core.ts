import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing({
  errorFormatter: (err) => {
    console.error("UploadThing Error:", err);
    return {
      message: err.message,
      code: err.code,
    };
  },
});

export const ourFileRouter = {
  documentUploader: f({
    "application/pdf": { maxFileSize: "8MB", maxFileCount: 10 },
    "image/jpeg": { maxFileSize: "8MB", maxFileCount: 10 },
    "image/png": { maxFileSize: "8MB", maxFileCount: 10 },
    "application/msword": { maxFileSize: "8MB", maxFileCount: 10 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "8MB", maxFileCount: 10 },
  })
    .middleware(async ({ req, files }) => {
      // Validation de la taille des fichiers
      for (const file of files) {
        const maxSize = 8 * 1024 * 1024; // 8MB en bytes
        if (file.size > maxSize) {
          throw new UploadThingError({
            code: "TOO_LARGE",
            message: `Le fichier "${file.name}" est trop volumineux. Taille maximale autorisée : 8 MB. Taille du fichier : ${(file.size / 1024 / 1024).toFixed(2)} MB.`,
          });
        }
      }

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