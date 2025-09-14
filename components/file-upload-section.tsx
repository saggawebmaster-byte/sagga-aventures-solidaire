"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Trash2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UploadDropzone } from '@/lib/uploadthing';

export interface FileInfo {
  file?: File;
  id: string;
  nom: string;
  url: string;
  taille: number;
  type: string;
}

interface FileUploadSectionProps {
  readonly title: string;
  readonly icon: any;
  readonly files: FileInfo[];
  readonly onFilesChange: (files: FileInfo[]) => void;
  readonly categorie: 'IDENTITE' | 'RESSOURCES' | 'CHARGES';
}

export default function FileUploadSection({ 
  title, 
  icon: Icon, 
  files, 
  onFilesChange, 
  categorie 
}: FileUploadSectionProps) {
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const removeFile = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  const totalSize = files.reduce((acc, file) => acc + file.taille, 0);
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getDocumentExamples = (categorie: string) => {
    switch (categorie) {
      case 'IDENTITE':
        return ['Carte d\'identité', 'Passeport', 'Carte de résident', 'Livret de famille'];
      case 'RESSOURCES':
        return ['Bulletins de salaire', 'Avis d\'imposition', 'Attestation CAF', 'Contrat CER'];
      case 'CHARGES':
        return ['Quittances de loyer', 'Factures EDF/GDF', 'Frais de transport', 'Frais de santé'];
      default:
        return [];
    }
  };

  return (
    <Card className="border-0 shadow-md transition-all duration-200 hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[#752D8B] to-[#5a2269] text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon className="h-5 w-5 mr-2" />
            <span>{title}</span>
          </div>
          <Badge 
            variant="secondary" 
            className="bg-white text-[#752D8B] font-medium"
            aria-label={`${files.length} fichier${files.length !== 1 ? 's' : ''} uploadé${files.length !== 1 ? 's' : ''}`}
          >
            {files.length} fichier{files.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Examples section */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            📄 Documents attendus :
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            {getDocumentExamples(categorie).map((example) => (
              <li key={example} className="flex items-center">
                <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                {example}
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Glissez-déposez vos fichiers ou cliquez pour sélectionner
            </p>
          </div>
          <UploadDropzone
            endpoint="documentUploader"
            onClientUploadComplete={(res) => {
              setIsUploading(false);
              if (res) {
                try {
                  const newFiles: FileInfo[] = res.map(file => ({
                    id: `${file.name}-${Date.now()}-${Math.random()}`,
                    nom: file.name,
                    url: file.url,
                    taille: file.size,
                    type: file.type || 'application/octet-stream',
                  }));
                  onFilesChange([...files, ...newFiles]);
                  setError('');
                  console.log("Fichiers ajoutés avec succès:", res);
                } catch (err) {
                  console.error("Erreur lors du traitement des fichiers uploadés:", err);
                  setError(`Erreur lors du traitement des fichiers: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
                }
              }
            }}
            onUploadError={(error: Error) => {
              console.error("Erreur d'upload:", error);
              setIsUploading(false);
              setError(`Erreur d'upload: ${error.message}`);
            }}
            onUploadBegin={() => {
              setIsUploading(true);
              setError('');
              console.log("Début de l'upload...");
            }}
            appearance={{
              container: "border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#752D8B] transition-colors focus-within:border-[#752D8B] focus-within:ring-2 focus-within:ring-[#752D8B] focus-within:ring-opacity-20",
              uploadIcon: "text-gray-400",
              label: "text-sm text-gray-600 font-medium",
              allowedContent: "text-xs text-gray-500 mt-2",
              button: "bg-[#752D8B] hover:bg-[#5a2269] transition-colors",
            }}
            config={{
              mode: "auto",
            }}
          />
        </div>

        {isUploading && (
          <div className="text-center py-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#752D8B] mx-auto"></div>
            <p className="text-sm text-blue-700 mt-2 font-medium">Upload en cours...</p>
            <p className="text-xs text-blue-600">Veuillez patienter</p>
          </div>
        )}

        {files.length > 0 && (
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Fichiers sélectionnés :</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  Total : {formatFileSize(totalSize)}
                </Badge>
                <Badge variant="outline" className="text-xs text-green-700 border-green-300">
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
                    <FileText className="h-4 w-4 text-[#752D8B] mr-3 flex-shrink-0" />
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
                    onClick={() => removeFile(fileInfo.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors ml-2"
                    aria-label={`Supprimer le fichier ${fileInfo.nom}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File format info */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
          <p className="font-medium mb-1">ℹ️ Formats acceptés :</p>
          <p>PDF, JPG, PNG, Word • Taille max : 1 MB par fichier</p>
        </div>
      </CardContent>
    </Card>
  );
}