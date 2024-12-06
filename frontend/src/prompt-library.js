import React, { useState } from 'react';
import { 
  Plus,
  Search, 
  Trash2,
  Tag,
  FileText,
  Filter,
  Copy 
} from 'lucide-react';

// Main Prompt Library Component
export const PromptLibrary = () => {
  const [prompts, setPrompts] = useState([
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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const categories = ['Text Processing', 'Development', 'Research', 'Other'];
  const allTags = ['summarization', 'nlp', 'coding', 'review'];

  const filteredPrompts = prompts.filter(prompt => 
    prompt.prompt_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? prompt.prompt_category === selectedCategory : true) &&
    (selectedTags.length > 0 
      ? selectedTags.every(tag => prompt.prompt_tags.includes(tag)) 
      : true)
  );

  const handleCopyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt.prompt_content);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <FileText className="mr-2" />Prompts
        </h1>
        <CreatePromptLibraryDialog  onCreatePromptLibrary={(newPromptLibrary) => setPrompts([...prompts, newPromptLibrary])} />
      </div>

      <div className="flex space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-3 text-gray-400" />
          <input 
            placeholder="Search prompts..." 
            className="w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-[180px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Filter className="text-gray-500" />
        <div className="flex space-x-2">
          {allTags.map(tag => (
            <span 
              key={tag} 
              className={`px-2 py-1 rounded-full text-sm cursor-pointer ${
                selectedTags.includes(tag) 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => 
                setSelectedTags(prev => 
                  prev.includes(tag) 
                    ? prev.filter(t => t !== tag) 
                    : [...prev, tag]
                )
              }
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.map(prompt => (
          <PromptCard 
            key={prompt.prompt_id} 
            prompt={prompt} 
            onCopy={() => handleCopyPrompt(prompt)}
            onDelete={() => setPrompts(prompts.filter(p => p.prompt_id !== prompt.prompt_id))}
          />
        ))}
      </div>
    </div>
  );
};

// Prompt Card Component
export const PromptCard = ({ prompt }) => {
  return (
    <div className="border rounded-lg shadow-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">{prompt.prompt_library_name} : {prompt.prompt_title}</h2>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-2">
          {prompt.prompt_content.slice(0, 100)}...
        </p>
        <div className="flex space-x-2 mt-2">
          <span className="px-2 py-1 bg-gray-200 rounded-full text-sm flex items-center">
            <Tag className="mr-1 h-3 w-3" /> {prompt.prompt_category}
          </span>
          {prompt.prompt_tags.map(tag => (
            <span 
              key={tag} 
              className="px-2 py-1 border rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Create Prompt Dialog Component
const CreatePromptLibraryDialog = ({ onCreatePromptLibrary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPromptLibrary, setNewPromptLibrary] = useState({
    prompt_library_name: '',
    prompt_library_description: '',
    prompt_library_file: null, // File input
  });

  const handleFileChange = (e) => {
    setNewPromptLibrary({
      ...newPromptLibrary,
      prompt_library_file: e.target.files[0],
    });
  };

  const handleSubmit = () => {

    if (
      !newPromptLibrary.prompt_library_name ||
      !newPromptLibrary.prompt_library_description ||
      !newPromptLibrary.prompt_library_file
    ) {
      alert('Please fill out all fields and upload a file.');
      return;
    }

    onCreatePromptLibrary({
      ...newPromptLibrary,
      id: String(Date.now())
    });
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-100"
      >
        <Plus className="mr-2 h-4 w-4" /> Create Prompt Libray
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Library</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <input 
                placeholder="Library Name" 
                className="w-full px-3 py-2 border rounded-md"
                value={newPromptLibrary.prompt_library_name}
                onChange={(e) => setNewPromptLibrary({...newPromptLibrary, prompt_library_name: e.target.value})}
              />
              <input 
                placeholder="Library Description"
                className="w-full px-3 py-2 border rounded-md"
                value={newPromptLibrary.prompt_library_description}
                onChange={(e) => setNewPromptLibrary({...newPromptLibrary, prompt_library_description: e.target.value})}
              />
               <input
                type="file"
                className="w-full px-3 py-2 border rounded-md"
                onChange={handleFileChange}
              />

              <button 
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

