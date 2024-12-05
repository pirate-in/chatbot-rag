import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Library, 
  Upload, 
  Send, 
  Workflow,
  Folder,
  ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Sample libraries and prompts data
const initialLibraries = [
  {
    id: '1',
    name: 'Technical Writing',
    prompts: [
      { 
        id: 'tech1', 
        title: 'Article Summarization', 
        content: 'Summarize the following technical document:' 
      },
      { 
        id: 'tech2', 
        title: 'Technical Report', 
        content: 'Convert the input into a structured technical report:' 
      }
    ]
  },
  {
    id: '2',
    name: 'Code Review',
    prompts: [
      { 
        id: 'code1', 
        title: 'Code Quality Check', 
        content: 'Analyze the following code for best practices:' 
      }
    ]
  }
];

const PromptLibraryApp = () => {
  const [libraries, setLibraries] = useState(initialLibraries);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [responses, setResponses] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const promptId = e.dataTransfer.getData('text/plain');
    const prompt = selectedLibrary.prompts.find(p => p.id === promptId);
    if (prompt && !selectedPrompts.find(p => p.id === promptId)) {
      setSelectedPrompts([...selectedPrompts, prompt]);
    }
  };

  const executePrompts = () => {
    if (!uploadedFile || selectedPrompts.length === 0) return;

    // Simulate SSE event responses
    const mockResponses = selectedPrompts.map(prompt => ({
      id: `response-${prompt.id}`,
      prompt: prompt.title,
      content: `Processed ${uploadedFile.name} with ${prompt.title} prompt`
    }));

    setResponses(mockResponses);
  };

  return (
    <div className="flex h-screen">
      {/* Left Navigation */}
      <div className="w-64 bg-gray-100 p-4 border-r">
        <div className="flex items-center mb-4">
          <Library className="mr-2" />
          <h2 className="text-xl font-bold">Prompt Libraries</h2>
        </div>
        
        <Select 
          value={selectedLibrary?.id} 
          onValueChange={(id) => {
            setSelectedLibrary(libraries.find(lib => lib.id === id));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Library">
              {selectedLibrary ? selectedLibrary.name : 'Choose Library'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {libraries.map(lib => (
              <SelectItem key={lib.id} value={lib.id}>
                {lib.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Prompts List */}
        {selectedLibrary && (
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Prompts</h3>
            {selectedLibrary.prompts.map(prompt => (
              <div 
                key={prompt.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', prompt.id);
                }}
                className="p-2 bg-white border mb-2 cursor-move hover:bg-gray-50"
              >
                {prompt.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 flex flex-col">
        {/* Document Upload Section */}
        <div 
          className="p-6 border-b flex items-center space-x-4"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div 
            className="flex-1 border-2 border-dashed p-4 text-center"
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="mx-auto mb-2" />
            {uploadedFile 
              ? `${uploadedFile.name}` 
              : 'Drag and drop or click to upload'}
          </div>

          <Select 
            value={documentType}
            onValueChange={setDocumentType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              {['PDF', 'DOCX', 'TXT', 'CSV'].map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <h3>Selected Prompts:</h3>
              {selectedPrompts.map(prompt => (
                <Badge key={prompt.id} variant="secondary">
                  {prompt.title}
                </Badge>
              ))}
            </div>
            <Button 
              onClick={executePrompts}
              disabled={!uploadedFile || selectedPrompts.length === 0}
            >
              <Send className="mr-2" /> Execute
            </Button>
          </div>
        </div>

        {/* Responses Section */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Responses</h2>
          {responses.map(response => (
            <Card key={response.id} className="mb-4">
              <CardHeader>
                <div className="font-semibold">{response.prompt}</div>
              </CardHeader>
              <CardContent>
                <p>{response.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptLibraryApp;