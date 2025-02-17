import React, { useState } from 'react';
import ReactFlow, { addEdge, MiniMap, Controls } from 'react-flow-renderer';

const GraphFlow = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [newNode, setNewNode] = useState({
    name: '',
    prompt: '',
    type: '',
    output: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNode((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNode = () => {
    if (!newNode.name || !newNode.prompt || !newNode.type || !newNode.output) {
      alert('All fields are required!');
      return;
    }

    const node = {
      id: `${nodes.length + 1}`,
      data: { label: newNode.name, ...newNode },
      position: { x: Math.random() * 250, y: Math.random() * 250 },
    };

    setNodes((nds) => nds.concat(node));
    setNewNode({
      name: '',
      prompt: '',
      type: '',
      output: '',
    });
  };

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  return (
    <div className="p-4 h-screen">
      <h2 className="text-xl font-bold mb-4">Create Graph & Flow</h2>

      {/* Input Form for Creating Nodes */}
      <div className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={newNode.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter node name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Prompt</label>
          <input
            type="text"
            name="prompt"
            value={newNode.prompt}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter prompt"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Type</label>
          <input
            type="text"
            name="type"
            value={newNode.type}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter type"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Output</label>
          <input
            type="text"
            name="output"
            value={newNode.output}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter output"
          />
        </div>

        <button
          onClick={handleAddNode}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Node
        </button>
      </div>

      {/* Graph Visualization */}
      <div className="h-full">
        <ReactFlow nodes={nodes} edges={edges} onConnect={onConnect} fitView>
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default GraphFlow;