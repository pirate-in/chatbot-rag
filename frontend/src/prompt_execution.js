import React, { useState } from "react";
import { Upload, FileText, ArrowRightCircle } from "lucide-react";
import PromptCard from './prompt-library'
const PromptExecutionViewV01 = () => {

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
        },
        {
            library_id: '#2#',
            library_name: 'Coding Statdards',
          }
      ]);
  const [selectedLibrary, setSelectedLibrary] = useState("");
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleLibraryChange = (e) => {
    const libraryName = e.target.value;
    setSelectedLibrary(libraryName);

    // Load available prompts for the selected library
    const library = libraries.find((lib) => lib.name === libraryName);
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
    if (!selectedPrompts.some((p) => p.id === droppedPrompt.id)) {
      setSelectedPrompts((prev) => [...prev, droppedPrompt]);
    }
  };

  const handleFileUpload = (e) => {
    setUploadedFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (uploadedFile && selectedPrompts.length > 0) {
      alert(`File "${uploadedFile.name}" submitted with ${selectedPrompts.length} prompts!`);
    } else {
      alert("Please upload a file and add at least one prompt.");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Library Selection */}
      <div className="flex space-x-4 items-center">

        <label htmlFor="library-select" className="text-lg font-semibold">
          Select Prompt Library:
        </label>
        <select
          id="library-select"
          value={selectedLibrary}
          onChange={handleLibraryChange}
          className="w-[180px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select a library</option>
          {libraries?.map((library) => (
            <option key={library.library_id} value={library.library_name}>
              {library.library_name}
            </option>
          ))}
        </select>
      </div>

      {/* Panels */}
      {selectedLibrary && (
        <div className="grid grid-cols-2 gap-4">
          {/* Left Panel: Available Prompts */}
          <div
            className="border rounded-lg p-4 space-y-2 h-[400px] overflow-y-auto"
            onDragOver={(e) => e.preventDefault()}
          >
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
                <ArrowRightCircle className="h-5 w-5 text-blue-500" />
              </div>
            ))}
          </div>

          {/* Right Panel: Selected Prompts */}
          <div
            className="border rounded-lg p-4 space-y-2 h-[400px] overflow-y-auto"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <FileText className="mr-2" /> Selected Prompts
            </h2>
            {selectedPrompts.length > 0 ? (
              selectedPrompts.map((prompt) => (
                <div key={prompt.id} className="p-2 border rounded-md bg-gray-100">
                  {prompt.title}
                </div>
              ))
            ) : (
              <p className="text-gray-500">Drag prompts here...</p>
            )}
          </div>
        </div>
      )}

      {/* Upload File and Submit */}
      {selectedLibrary && (
        <div className="border-t pt-4">
          <div className="flex space-x-4 items-center">
            <label htmlFor="file-upload" className="text-lg font-semibold">
              Upload File:
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              className="px-3 py-2 border rounded-md"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default PromptExecutionViewV01;
