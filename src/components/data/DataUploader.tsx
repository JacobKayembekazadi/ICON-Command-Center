import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const DataUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
    }
  };

  const handleProcess = () => {
    if (!file) return;
    setStatus('processing');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        // Basic validation
        if (lines.length < 2) throw new Error('Empty CSV');
        
        // Simulate processing delay for UX
        setTimeout(() => {
          console.log(`Processed ${lines.length - 1} rows`);
          setStatus('success');
        }, 1500);
      } catch (error) {
        console.error('CSV Error:', error);
        setStatus('error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card title="Import Data">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging 
            ? 'border-[#00D9FF] bg-[#00D9FF]/5' 
            : 'border-[#2d3548] hover:border-[#00D9FF]/50'
        }`}
      >
        {status === 'success' ? (
          <div className="flex flex-col items-center text-green-500">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-3">
              <Check className="w-6 h-6" />
            </div>
            <p className="font-medium">Data imported successfully</p>
            <Button variant="ghost" size="sm" onClick={() => { setFile(null); setStatus('idle'); }} className="mt-4">
              Upload another
            </Button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-[#1a1f3a] rounded-full flex items-center justify-center mx-auto mb-4">
              {file ? <FileText className="w-6 h-6 text-[#00D9FF]" /> : <Upload className="w-6 h-6 text-gray-400" />}
            </div>
            
            {file ? (
              <div className="mb-4">
                <p className="font-medium text-white">{file.name}</p>
                <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div className="mb-4">
                <p className="font-medium text-gray-300">Drag & drop CSV file here</p>
                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              </div>
            )}

            {file && (
              <Button 
                onClick={handleProcess} 
                isLoading={status === 'processing'}
                className="w-full max-w-[200px]"
              >
                Process File
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
