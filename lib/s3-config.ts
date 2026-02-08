import { S3Client } from '@aws-sdk/client-s3'

// Configuration du client S3 pour OVH
export const s3Client = new S3Client({
  endpoint: process.env.OVH_S3_ENDPOINT || 'https://s3.sbg.io.cloud.ovh.net',
  region: process.env.OVH_S3_REGION || 'sbg',
  credentials: {
    accessKeyId: process.env.OVH_S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.OVH_S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true, // Important pour la compatibilité S3
})

export const S3_BUCKET_NAME = process.env.OVH_S3_BUCKET_NAME || 's3-sagga-fichiers'

// URL publique correcte pour OVH S3 (format avec bucket dans le sous-domaine)
export const S3_BASE_URL = `https://${S3_BUCKET_NAME}.s3.${process.env.OVH_S3_REGION || 'sbg'}.io.cloud.ovh.net`
