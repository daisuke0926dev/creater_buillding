import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  currentImageUrl?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, currentImageUrl }) => {
  const [preview, setPreview] = useState<string | undefined>(currentImageUrl);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // プレビューURLを作成
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onImageSelect(file);

      // クリーンアップ
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <div className="text-gray-600">
            {isDragActive ? (
              <p>ここにドロップしてください</p>
            ) : (
              <p>クリックまたはドラッグ&ドロップで画像をアップロード</p>
            )}
          </div>
          <p className="text-sm text-gray-500">
            JPG, PNG, GIF (最大5MB)
          </p>
        </div>
      </div>

      {preview && (
        <div className="relative w-32 h-32 mx-auto">
          <img
            src={preview}
            alt="プレビュー"
            className="w-full h-full object-cover rounded-full"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setPreview(undefined);
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}; 