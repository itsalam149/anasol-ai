"use client"

import { useDraggable } from "@dnd-kit/core"
import { MessageSquare, ImageIcon, Code, FileText, Zap, Brain } from "lucide-react"

const blockTypes = [
  { id: "text-prompt", name: "Text Prompt", icon: MessageSquare, color: "bg-blue-500" },
  { id: "image-generator", name: "Image Generator", icon: ImageIcon, color: "bg-purple-500" },
  { id: "code-generator", name: "Code Generator", icon: Code, color: "bg-green-500" },
  { id: "text-analyzer", name: "Text Analyzer", icon: FileText, color: "bg-orange-500" },
  { id: "transformer", name: "Transformer", icon: Zap, color: "bg-yellow-500" },
  { id: "ai-agent", name: "AI Agent", icon: Brain, color: "bg-red-500" },
]

function DraggableBlockType({ type }: { type: (typeof blockTypes)[0] }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-${type.id}`,
    data: { type: type.id },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center space-x-3 p-3 bg-white rounded-lg border border-sky-200 cursor-grab hover:border-sky-300 hover:shadow-md transition-all duration-200 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className={`p-2 rounded-md ${type.color} text-white`}>
        <type.icon size={16} />
      </div>
      <span className="text-sm font-medium text-gray-700">{type.name}</span>
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="w-64 bg-sky-50 border-r border-sky-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-sky-900 mb-4">Block Library</h2>

      <div className="space-y-3">
        {blockTypes.map((type) => (
          <DraggableBlockType key={type.id} type={type} />
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-md font-medium text-sky-800 mb-3">Recent Workflows</h3>
        <div className="space-y-2">
          <div className="p-2 bg-white rounded border border-sky-200 text-sm text-gray-600 cursor-pointer hover:bg-sky-50">
            Content Generator
          </div>
          <div className="p-2 bg-white rounded border border-sky-200 text-sm text-gray-600 cursor-pointer hover:bg-sky-50">
            Data Analyzer
          </div>
        </div>
      </div>
    </div>
  )
}
