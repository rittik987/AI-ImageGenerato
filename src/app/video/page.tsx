'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function ImageToVideo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [duration, setDuration] = useState<5 | 10>(5);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => setSelectedFile(acceptedFiles[0]),
  });

  const handleGenerateVideo = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('duration', duration.toString());
    formData.append('orientation', orientation);

    try {
      const { data } = await axios.post('/api/img2vdo', formData);
      console.log('Server response:', data);
      
      if (data && data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error generating video:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to generate video. Please try again.');
    }
    
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <div {...getRootProps()} className="border-dashed border-2 p-10 cursor-pointer text-center">
        <input {...getInputProps()} />
        {selectedFile ? (
          <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-32 h-32 object-contain mt-2" />
        ) : (
          <p>Drag & drop an image or click to select</p>
        )}
      </div>
      
      <div className="flex space-x-4">
        <button className={`px-4 py-2 rounded ${duration === 5 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setDuration(5)}>5s</button>
        <button className={`px-4 py-2 rounded ${duration === 10 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setDuration(10)}>10s</button>
      </div>

      <div className="flex space-x-4">
        <button className={`px-4 py-2 rounded ${orientation === 'portrait' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setOrientation('portrait')}>Portrait</button>
        <button className={`px-4 py-2 rounded ${orientation === 'landscape' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setOrientation('landscape')}>Landscape</button>
      </div>

      <button onClick={handleGenerateVideo} disabled={loading || !selectedFile} className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400">
        {loading ? 'Generating...' : 'Generate Video'}
      </button>
      
      {error && <p className="text-red-500 mt-2">{error}</p>}
      
      {videoUrl && (
        <video controls className="mt-4 w-full max-w-md">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
