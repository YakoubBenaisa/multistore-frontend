import { useState } from 'react';
import api from '../../../../api/api'; // Adjust the path as needed

export const useGetImage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getImage = async (imageName: string) => {
    setLoading(true);
    setError(null);
    try {
      // Request the image as a Blob
      const response = await api.get(`products/images/${imageName}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob', // Important: get the response as a Blob
      });
      // Create an object URL from the blob
      const blob = response.data as Blob;
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
      return imageUrl;
    } catch (err: any) {
        console.log("error: "+err)
      setError(err.response?.data?.error?.message || 'Failed to retrieve image');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { image, getImage, loading, error };
};
