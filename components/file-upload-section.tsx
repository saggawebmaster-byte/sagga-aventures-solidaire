'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Upload, File, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useS3Upload } from '@/lib/use-s3-upload'
import type { LucideIcon } from 'lucide-react'

export interface FileInfo {
  id?: string
  nom: string
  url: string
  taille: number
  type: string
  key?: string
}

interface FileUploadSectionProps {
  title: string
  icon: LucideIcon
  files: FileInfo[]
  onFilesChange: (files: FileInfo[]) => void
  categorie: 'IDENTITE' | 'RESSOURCES' | 'CHARGES'
}

export default function FileUploadSection({
  title,
  icon: Icon,
  files,
  onFilesChange,
  categorie,
}: FileUploadSectionProps) {
  const { uploadFile, isUploading, error } = useS3Upload()
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setUploadError(null)

    for (const file of selectedFiles) {
      // Validation côté client
      if (file.size > 8 * 1024 * 1024) {
        setUploadError(`${file.name}: Fichier trop volumineux (max 8MB)`)
        continue
      }

      // Upload vers S3
      const uploadedFile = await uploadFile(file, categorie)

      if (uploadedFile) {
        const newFile: FileInfo = {
          id: `${uploadedFile.name}-${Date.now()}-${Math.random()}`,
          nom: uploadedFile.name,
          url: uploadedFile.url,
          taille: uploadedFile.size,
          type: uploadedFile.type,
          key: uploadedFile.key,
        }
        onFilesChange([...files, newFile])
      } else {
        setUploadError(`Erreur lors de l'upload de ${file.name}`)
      }
    }

    // Reset l'input
    e.target.value = ''
  }

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getDocumentExamples = (categorie: string) => {
    switch (categorie) {
      case 'IDENTITE':
        return ['Carte d\'identité', 'Passeport', 'Carte de résident', 'Livret de famille']
      case 'RESSOURCES':
        return ['Bulletins de salaire', 'Avis d\'imposition', 'Attestation CAF', 'Contrat CER']
      case 'CHARGES':
        return ['Quittances de loyer', 'Factures EDF/GDF', 'Frais de transport', 'Frais de santé']
      default:
        return []
    }
  }

  const totalSize = files.reduce((acc, file) => acc + file.taille, 0)

  return (
    <Card className="border-0 shadow-md transition-all duration-200 hover:shadow-lg w-full">
      <CardHeader className="bg-gradient-to-r from-[#752D8B] to-[#5a2269] text-white rounded-t-lg px-3 sm:px-6 py-3 sm:py-4">
        <CardTitle className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
          <div className="flex items-center min-w-0 max-w-full">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 flex-shrink-0" />
            <span className="text-sm sm:text-base md:text-lg truncate">{title}</span>
          </div>
          <Badge
            variant="secondary"
            className="bg-white text-[#752D8B] font-medium text-xs whitespace-nowrap self-start xs:self-auto"
            aria-label={`${files.length} fichier${files.length !== 1 ? 's' : ''} uploadé${files.length !== 1 ? 's' : ''}`}
          >
            {files.length} fichier{files.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6 space-y-4">
        {/* Examples section */}
        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-xs sm:text-sm font-medium text-blue-900 mb-1.5 sm:mb-2">
            📄 Documents attendus :
          </h4>
          <ul className="text-xs text-blue-800 space-y-0.5 sm:space-y-1">
            {getDocumentExamples(categorie).map((example) => (
              <li key={example} className="flex items-start">
                <span className="w-1 h-1 bg-blue-600 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                <span className="break-words">{example}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Error display */}
        {(uploadError || error) && (
          <Alert variant="destructive" className="border-red-300 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-xs sm:text-sm">
              {uploadError || error}
            </AlertDescription>
          </Alert>
        )}

        {/* Upload zone */}
        <div className="space-y-2">
          <label className="block">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 hover:border-[#752D8B] transition-colors cursor-pointer text-center"
              onClick={(e) => {
                e.preventDefault()
                const input = e.currentTarget.parentElement?.querySelector('input')
                input?.click()
              }}
            >
              {isUploading ? (
                <div className="py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-[#752D8B] mx-auto" />
                  <p className="text-sm text-[#752D8B] mt-2 font-medium">Upload en cours...</p>
                  <p className="text-xs text-gray-600">Veuillez patienter</p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Glissez-déposez vos fichiers ici
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    ou cliquez pour sélectionner
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 bg-[#752D8B] text-white hover:bg-[#5a2269] border-none"
                    disabled={isUploading}
                  >
                    Choisir des fichiers
                  </Button>
                </>
              )}
            </div>
          </label>
        </div>

        {/* Files list */}
        {files.length > 0 && (
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Fichiers sélectionnés :</span>
              <div className="flex items-center space-x-2 flex-wrap gap-1">
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  Total : {formatFileSize(totalSize)}
                </Badge>
                <Badge variant="outline" className="text-xs text-green-700 border-green-300 whitespace-nowrap">
                  ✓ {files.length} OK
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              {files.map((fileInfo) => (
                <div
                  key={fileInfo.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <File className="h-4 w-4 text-[#752D8B] mr-3 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate" title={fileInfo.nom}>
                        {fileInfo.nom}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{formatFileSize(fileInfo.taille)}</span>
                        <span>•</span>
                        <span className="capitalize">{fileInfo.type.split('/')[1] || 'Document'}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileInfo.id!)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors ml-2"
                    aria-label={`Supprimer le fichier ${fileInfo.nom}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File format info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
          <p className="font-medium mb-1">ℹ️ Formats acceptés :</p>
          <p>PDF, JPG, PNG, Word • Taille max : 8 MB par fichier</p>
        </div>
      </CardContent>
    </Card>
  )
}
