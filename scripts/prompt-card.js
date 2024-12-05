import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Tag, 
  FileText, 
  Filter,
  Copy
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Main Prompt Library Component
const PromptLibrary = () => {
  const [prompts, setPrompts] = useState([
    {
      id: '1',
      title: 'Article Summarization',
      content: 'Summarize the following article in 3-5 key points:',
      tags: ['summarization', 'nlp'],
      category: 'Text Processing'
    },
    {
      id: '2', 
      title: 'Code Review',
      content: 'Review the following code for best practices:',
      tags: ['coding', 'review'],
      category: 'Development'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const categories = ['Text Processing', 'Development', 'Research', 'Other'];
  const allTags = ['summarization', 'nlp', 'coding', 'review'];

  const filteredPrompts = prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? prompt.category === selectedCategory : true) &&
    (selectedTags.length > 0 
      ? selectedTags.every(tag => prompt.tags.includes(tag)) 
      : true)
  );

  const handleCopyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt.content);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <FileText className="mr-2" /> Prompt Library
        </h1>
        <CreatePromptDialog onCreatePrompt={(newPrompt) => setPrompts([...prompts, newPrompt])} />
      </div>

      <div className="flex space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-3 text-gray-400" />
          <Input 
            placeholder="Search prompts..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category">
              {selectedCategory || 'All Categories'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Filter className="text-gray-500" />
        <div className="flex space-x-2">
          {allTags.map(tag => (
            <Badge 
              key={tag} 
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              onClick={() => 
                setSelectedTags(prev => 
                  prev.includes(tag) 
                    ? prev.filter(t => t !== tag) 
                    : [...prev, tag]
                )
              }
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.map(prompt => (
          <PromptCard 
            key={prompt.id} 
            prompt={prompt} 
            onCopy={() => handleCopyPrompt(prompt)}
            onDelete={() => setPrompts(prompts.filter(p => p.id !== prompt.id))}
          />
        ))}
      </div>
    </div>
  );
};

// Prompt Card Component
const PromptCard = ({ prompt, onCopy, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{prompt.title}</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">
          {prompt.content.slice(0, 100)}...
        </p>
        <div className="flex space-x-2 mt-2">
          <Badge variant="secondary">
            <Tag className="mr-1 h-3 w-3" /> {prompt.category}
          </Badge>
          {prompt.tags.map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Create Prompt Dialog Component
const CreatePromptDialog = ({ onCreatePrompt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    content: '',
    tags: [],
    category: ''
  });

  const handleSubmit = () => {
    onCreatePrompt({
      ...newPrompt,
      id: String(Date.now())
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Create Prompt
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Prompt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            placeholder="Prompt Title" 
            value={newPrompt.title}
            onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})}
          />
          <Input 
            placeholder="Prompt Content"
            value={newPrompt.content}
            onChange={(e) => setNewPrompt({...newPrompt, content: e.target.value})}
          />
          <Select 
            value={newPrompt.category}
            onValueChange={(val) => setNewPrompt({...newPrompt, category: val})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {['Text Processing', 'Development', 'Research', 'Other'].map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromptLibrary;