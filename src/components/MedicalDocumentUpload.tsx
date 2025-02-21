import { useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface MedicalDocumentUploadProps {
  phoneId: string;
  currentFile?: File;
  onFileUpload: (file: File | null, url: string | null) => void;
}

export default function MedicalDocumentUpload({ phoneId, currentFile, onFileUpload }: MedicalDocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File) => {
    // Verificar o tamanho do arquivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > maxSize) {
      throw new Error('O arquivo é muito grande. O tamanho máximo permitido é 5MB.');
    }

    // Verificar o tipo do arquivo
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não permitido. Use PDF, DOC, DOCX, JPG ou PNG.');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      validateFile(file);
      setIsUploading(true);

      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${phoneId}/${Date.now()}.${fileExt}`;

      console.log('Iniciando upload...', {
        bucket: 'medical-documents',
        fileName,
        fileType: file.type
      });

      // Tentar upload direto
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Erro detalhado do upload:', uploadError);
        throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
      }

      console.log('Upload bem sucedido:', uploadData);

      // Gerar URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('medical-documents')
        .getPublicUrl(uploadData.path);

      console.log('URL pública gerada:', publicUrl);

      onFileUpload(file, publicUrl);
      toast.success('Arquivo enviado com sucesso!');
    } catch (error) {
      console.error('Erro completo:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao processar o arquivo. Por favor, tente novamente.');
      }
      onFileUpload(null, null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="block w-full p-4 rounded-xl bg-[#FF5733] text-white cursor-pointer hover:bg-[#ff6242] transition-all text-center">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Upload className="inline-block mr-2" size={20} />
        {isUploading ? 'Enviando...' : currentFile ? 'Trocar Laudo Médico' : 'Enviar Laudo Médico'}
      </label>
      {currentFile && (
        <p className="mt-2 text-sm text-white/70">
          Arquivo selecionado: {currentFile.name}
        </p>
      )}
    </div>
  );
} 