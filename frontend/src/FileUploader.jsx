// FileUploader.jsx
import React, { useRef, useState } from 'react';
import { FileUp, X } from 'lucide-react';

const FileUploader = ({ baseUrl }) => {
  const [files, setFiles] = useState([]);
  const [fileProgress, setFileProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    // Track upload progress for each file
    newFiles.forEach(file => uploadFile(file));
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Create a new XMLHttpRequest to track upload progress
    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setFileProgress(prev => ({
          ...prev,
          [file.name]: percentComplete
        }));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        // Upload complete
        setFileProgress(prev => ({
          ...prev,
          [file.name]: 100
        }));
      } else {
        // Handle error
        console.error('Upload failed');
        setFileProgress(prev => ({
          ...prev,
          [file.name]: -1 // Error state
        }));
      }
    };

    xhr.open('POST', `${baseUrl}upload`, true);
    xhr.send(formData);
  };

  const removeFile = (fileName) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
    setFileProgress(prev => {
      const { [fileName]: removed, ...remainingProgress } = prev;
      return remainingProgress;
    });
  };

  return (
    <div className="p-6">
      <div 
        className="border-2 border-dashed p-10 text-center cursor-pointer hover:bg-gray-100"
        onClick={() => fileInputRef.current.click()}
      >
        <FileUp className="mx-auto w-12 h-12 text-blue-500 mb-4" />
        <p>Drag and drop files here or click to upload</p>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
          {files.map(file => (
            <div 
              key={file.name} 
              className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg mb-2"
            >
              <div className="flex-grow">
                <div className="flex justify-between mb-1">
                  <span>{file.name}</span>
                  <span>
                    {fileProgress[file.name] !== undefined 
                      ? `${fileProgress[file.name]}%` 
                      : 'Queued'}
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      fileProgress[file.name] === 100 
                        ? 'bg-green-500' 
                        : 'bg-blue-600'
                    }`}
                    style={{ 
                      width: `${fileProgress[file.name] || 0}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  ></div>
                </div>
              </div>
              <button 
                onClick={() => removeFile(file.name)}
                className="text-red-500 hover:bg-red-100 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;