import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from './useAuth';

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<string>;
  isUploading: boolean;
  error: string | null;
}

export const useImageUpload = (path: string): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const storage = getStorage();

  const uploadImage = async (file: File): Promise<string> => {
    if (!user) {
      throw new Error('ユーザーが認証されていません');
    }

    try {
      setIsUploading(true);
      setError(null);

      // 画像のリサイズ処理（必要に応じて実装）
      const resizedFile = await resizeImage(file);

      // アップロード先のパスを生成
      const timestamp = Date.now();
      const fileName = `${user.uid}_${timestamp}_${file.name}`;
      const fullPath = `${path}/${fileName}`;
      const storageRef = ref(storage, fullPath);

      // 画像をアップロード
      await uploadBytes(storageRef, resizedFile);

      // ダウンロードURLを取得
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '画像のアップロードに失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    error,
  };
};

// 画像のリサイズ処理
async function resizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context is not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          resolve(new File([blob], file.name, { type: file.type }));
        },
        file.type,
        0.8
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
} 