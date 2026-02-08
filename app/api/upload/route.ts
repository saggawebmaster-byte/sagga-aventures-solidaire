import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client, S3_BUCKET_NAME, S3_BASE_URL } from '@/lib/s3-config'
import { nanoid } from 'nanoid'

export const runtime = 'nodejs'
export const maxDuration = 60

// Taille max: 8MB
const MAX_FILE_SIZE = 8 * 1024 * 1024

// Types de fichiers autorisés
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const categorie = formData.get('categorie') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validation du type de fichier
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Type de fichier non autorisé: ${file.type}. Formats acceptés: PDF, JPG, PNG, Word` },
        { status: 400 }
      )
    }

    // Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 8MB)' },
        { status: 400 }
      )
    }

    // Générer un nom de fichier unique
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${categorie}/${nanoid()}.${fileExtension}`

    // Convertir le fichier en Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload vers S3
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
      // Rendre le fichier public
      ACL: 'public-read',
      Metadata: {
        originalName: file.name,
        categorie: categorie || 'AUTRE',
        uploadDate: new Date().toISOString(),
      },
    })

    await s3Client.send(command)

    // URL du fichier
    const fileUrl = `${S3_BASE_URL}/${uniqueFileName}`

    return NextResponse.json({
      success: true,
      file: {
        url: fileUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        key: uniqueFileName,
      },
    })
  } catch (error) {
    console.error('Erreur upload S3:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'upload du fichier',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}
