import React, { useState } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";
import {PromptCard} from './prompt-library'
const PromptExecutionView = () => {
  const [selectedLibrary, setSelectedLibrary] = useState("");
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [executionResponse, setExecutionResponse] = useState("");

  const [availablePrompts, setAvailablePrompts] = useState([
    {
      prompt_id: '1',
      prompt_title: 'Article Summarization',
      prompt_library_name: 'Article Library',
      prompt_content: 'Summarize the following article in 3-5 key points:',
      prompt_tags: ['summarization', 'nlp'],
      prompt_category: 'Text Processing'
    },
    {
      prompt_id: '2', 
      prompt_title: 'Code Review',
      prompt_library_name: 'Coding standards',
      prompt_content: 'Review the following code for best practices:',
      prompt_tags: ['coding', 'review'],
      prompt_category: 'Development'
    }
  ]);

    const [libraries, setLibraries] = useState([
    {
      library_id: '#1#',
      library_name: 'Article Library',
      prompts :    [{
        prompt_id: '1',
        prompt_title: 'Article Summarization',
        prompt_library_name: 'Article Library',
        prompt_content: 'Summarize the following article in 3-5 key points:',
        prompt_tags: ['summarization', 'nlp'],
        prompt_category: 'Text Processing'
      },
      {
        prompt_id: '2', 
        prompt_title: 'Code Review',
        prompt_library_name: 'Coding standards',
        prompt_content: 'Review the following code for best practices:',
        prompt_tags: ['coding', 'review'],
        prompt_category: 'Development'
      }]
    },
    {
        library_id: '#2#',
        library_name: 'Coding Statdards',
        prompts :    [{
          prompt_id: '3',
          prompt_title: 'Article Summarization',
          prompt_library_name: 'Article Library',
          prompt_content: 'Summarize the following article in 3-5 key points:',
          prompt_tags: ['summarization', 'nlp'],
          prompt_category: 'Text Processing'
        },
        {
          prompt_id: '4', 
          prompt_title: 'Code Review',
          prompt_library_name: 'Coding standards',
          prompt_content: 'Review the following code for best practices:',
          prompt_tags: ['coding', 'review'],
          prompt_category: 'Development'
        }]
      }
  ]);

  const handleLibraryChange = (e) => {
    const libraryName = e.target.value;
    console.log('handleLibraryChange[] '+libraryName)

    setSelectedLibrary(libraryName);
    // Load available prompts for the selected library
    const library = libraries.find((lib) => lib.library_name === libraryName);
    setAvailablePrompts(library ? library.prompts : []);
    setSelectedPrompts([]);
  };

  const handleDragStart = (e, prompt) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(prompt));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedPrompt = JSON.parse(e.dataTransfer.getData("text/plain"));

    // Add the prompt to the selected prompts list if not already added
    if (!selectedPrompts.some((p) => p.prompt_id === droppedPrompt.prompt_id)) {
      setSelectedPrompts((prev) => [...prev, droppedPrompt]);
    }
  };

  const handleFileUpload = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const handleExecute = () => {
    if (uploadedFile && selectedPrompts.length > 0) {
      setExecutionResponse(
        `Execution successful! Uploaded file: "${uploadedFile.name}", Prompts executed: ${selectedPrompts
          .map((p) => p.title)
          .join(", ")}`
      );
    } else {
      setExecutionResponse("Please upload a file and add at least one prompt.");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex space-x-4 h-[500px]">
        {/* Left Panel */}
        <div className="w-1/2 border rounded-lg p-4 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="library-select" className="text-lg font-semibold block mb-2">
              Select Prompt Library:
            </label>
            <select
              id="library-select"
              value={selectedLibrary}
              onChange={handleLibraryChange}
              className="w-[180px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select a library</option>
              {libraries?.map((library) => (
                <option key={library.library_name} value={library.library_name}>
                  {library.library_name}
                </option>
              ))}
          </select>
          </div>

          {selectedLibrary && (
            <div>
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <FileText className="mr-2" /> Available Prompts
              </h2>
              {availablePrompts.map((prompt) => (
                <div
                  key={prompt.prompt_id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, prompt)}
                  className="p-2 border rounded-md cursor-grab hover:bg-gray-100 flex items-center justify-between"
                >
                 <PromptCard prompt={prompt}></PromptCard>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div
          className="w-1/2 border rounded-lg p-4 space-y-4"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <Upload className="mr-2" /> Drag & Drop Prompts and Upload File
          </h2>
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 space-y-2 h-[250px] overflow-y-auto">
            {selectedPrompts.length > 0 ? (
              selectedPrompts.map((prompt) => (
                <div key={prompt.prompt_id} className="p-2 border rounded-md bg-gray-100">
                  {prompt.prompt_title}
                </div>
              ))
            ) : (
              <p className="text-gray-500">Drag prompts here...</p>
            )}
          </div>

          <div>
            <label htmlFor="file-upload" className="block text-lg font-semibold mb-2">
              Upload File:
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              className="px-3 py-2 border rounded-md w-full"
            />
          </div>

          <button
            onClick={handleExecute}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Execute
          </button>
        </div>
      </div>

      {/* Execution Response */}
      {executionResponse && (
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <CheckCircle className="mr-2" /> Execution Response
          </h2>
          <p className="text-gray-700">{executionResponse}</p>
        </div>
      )}
    </div>
  );
};

export default PromptExecutionView;
