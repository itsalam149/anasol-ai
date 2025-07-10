"use client"

import { useDroppable } from "@dnd-kit/core"
import { useWorkflowStore } from "../store/workflowStore"
import { BlockItem } from "./BlockItem"

export function Canvas() {
  const { setNodeRef } = useDroppable({
    id: "canvas",
  })

  const { blocks } = useWorkflowStore()

  return (
    <div className="flex-1 relative overflow-hidden">
      <div ref={setNodeRef} className="w-full h-full canvas-grid relative">
        {blocks.map((block) => (
          <BlockItem key={block.id} block={block} />
        ))}

        {blocks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-medium mb-2">Start Building Your Workflow</h3>
              <p className="text-sm">Drag blocks from the sidebar to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
