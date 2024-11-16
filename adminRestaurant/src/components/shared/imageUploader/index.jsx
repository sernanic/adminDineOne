import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@supabase/supabase-js';
import { getAuth } from 'firebase/auth';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

/**
 * ImageUploader Component
 * 
 * A reusable component for handling image uploads to Supabase Storage.
 * Supports drag and drop functionality and displays upload progress.
 * 
 * @param {Object} props
 * @param {string} props.bucketName - The Supabase Storage bucket folder name
 * @param {function} props.onImageUploaded - Callback function when image upload is complete
 */
export default function ImageUploader({ onImageUploaded, bucketName }) {
  // State management for component
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handles the file upload process to Supabase Storage
   * @param {File[]} acceptedFiles - The files to upload
   */
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploading(true);
    setError(null);

    try {
      // Sanitize the file name
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
      const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }


      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from(bucketName) // Use the bucketName prop
        .upload(uniqueFileName, file);

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw error;
      }

      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from(bucketName) // Use the bucketName prop
        .getPublicUrl(data.path);

      if (urlError) {
        console.error('Error getting public URL:', urlError);
        throw urlError;
      }

      setImageUrl(publicUrl);
      
      if (onImageUploaded) {
        onImageUploaded(publicUrl);
      }
    } catch (error) {
      console.error('Error in onDrop function:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onImageUploaded, bucketName]); // Add bucketName to the dependency array

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div>
      <div {...getRootProps()} style={{
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer'
      }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>Drag 'n' drop a PNG or JPEG image here, or click to select one</p>
        )}
      </div>
      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && (
        <></>
        
      )}
    </div>
  );
}