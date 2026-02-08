import { useState } from 'react'

export interface UploadedFile {
  url: string
  name: string
  size: number
  type: string
  key: string
}

export function useS3Upload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = async (
    file: File,
    categorie: string
  ): Promise<UploadedFile | null> => {
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('categorie', categorie)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upload')
      }

      return data.file
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      console.error('Erreur upload:', err)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadFile, isUploading, error }
}
