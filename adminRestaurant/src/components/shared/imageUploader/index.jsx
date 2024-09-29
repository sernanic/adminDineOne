import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@supabase/supabase-js';
import { getAuth } from 'firebase/auth';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function ImageUploader({ onImageUploaded, bucketName }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploading(true);
    setError(null);

    try {
      console.log('Original file name:', file.name);
      
      // Sanitize the file name
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
      console.log("sanitizedFileName", sanitizedFileName)
      const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;
      
      console.log('Sanitized file name:', uniqueFileName);

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const token = await user.getIdToken();

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from(bucketName) // Use the bucketName prop
        .upload(uniqueFileName, file);

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw error;
      }

      console.log('File uploaded successfully:', data);
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from(bucketName) // Use the bucketName prop
        .getPublicUrl(data.path);

      if (urlError) {
        console.error('Error getting public URL:', urlError);
        throw urlError;
      }

      setImageUrl(publicUrl);
      console.log("Image URL set:", publicUrl);
      
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
      <div {...getRootProps()} style={dropzoneStyles}>
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
        <div>
          <p>Uploaded image URL:</p>
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a>
        </div>
      )}
    </div>
  );
}

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer'
};