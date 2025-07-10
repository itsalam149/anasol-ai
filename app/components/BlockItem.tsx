"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { MessageSquare, ImageIcon, Code, FileText, Zap, Brain, Play, Copy, Trash2, Edit3 } from "lucide-react"
import type { Block } from "../types/workflow"
import { useWorkflowStore } from "../store/workflowStore"

const blockIcons = {
  "text-prompt": MessageSquare,
  "image-generator": ImageIcon,
  "code-generator": Code,
  "text-analyzer": FileText,
  transformer: Zap,
  "ai-agent": Brain,
}

const blockColors = {
  "text-prompt": "border-blue-300 bg-blue-50",
  "image-generator": "border-purple-300 bg-purple-50",
  "code-generator": "border-green-300 bg-green-50",
  "text-analyzer": "border-orange-300 bg-orange-50",
  transformer: "border-yellow-300 bg-yellow-50",
  "ai-agent": "border-red-300 bg-red-50",
}

interface BlockItemProps {
  block: Block
  isDragging?: boolean
}

export function BlockItem({ block, isDragging = false }: BlockItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(block.content || "")
  const { updateBlock, deleteBlock, duplicateBlock, runBlock } = useWorkflowStore()

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: block.id,
    data: {
      isBlock: true,
      position: block.position,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const Icon = blockIcons[block.type as keyof typeof blockIcons]
  const colorClass = blockColors[block.type as keyof typeof blockColors]

  const handleSave = () => {
    updateBlock(block.id, { content })
    setIsEditing(false)
  }

  const handleRun = async () => {
    await runBlock(block.id)
  }

  if (isDragging) {
    return (
      <div className={`w-64 p-4 rounded-lg border-2 ${colorClass} block-shadow opacity-80`}>
        <div className="flex items-center space-x-2 mb-2">
          <Icon size={16} />
          <span className="font-medium text-sm">{block.type.replace("-", " ")}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: "absolute",
        left: block.position.x,
        top: block.position.y,
      }}
      {...listeners}
      {...attributes}
      className={`w-64 p-4 rounded-lg border-2 ${colorClass} block-shadow hover:block-shadow-hover transition-all duration-200 cursor-move group`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon size={16} />
          <span className="font-medium text-sm capitalize">{block.type.replace("-", " ")}</span>
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleRun}
            className="p-1 hover:bg-white rounded text-gray-600 hover:text-sky-600"
            title="Run Block"
          >
            <Play size={12} />
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 hover:bg-white rounded text-gray-600 hover:text-sky-600"
            title="Edit Block"
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={() => duplicateBlock(block.id)}
            className="p-1 hover:bg-white rounded text-gray-600 hover:text-sky-600"
            title="Duplicate Block"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={() => deleteBlock(block.id)}
            className="p-1 hover:bg-white rounded text-gray-600 hover:text-red-600"
            title="Delete Block"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your prompt or content..."
            className="w-full p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
            rows={3}
          />
          <div className="flex space-x-2">
            <button onClick={handleSave} className="px-3 py-1 bg-sky-500 text-white text-xs rounded hover:bg-sky-600">
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-sm text-gray-600 min-h-[60px]">{block.content || "Click edit to add content..."}</div>

          {block.output && (
            <div className="mt-3 p-2 bg-white rounded border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Output:</div>
              <div className="text-sm text-gray-700 max-h-20 overflow-y-auto">{block.output}</div>
            </div>
          )}

          {block.isLoading && (
            <div className="flex items-center space-x-2 text-sm text-sky-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-600"></div>
              <span>Processing...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
