"use client"

import { useState } from "react"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import { WorkflowProvider } from "./components/WorkflowProvider"
import { Navbar } from "./components/Navbar"
import { Sidebar } from "./components/Sidebar"
import { Canvas } from "./components/Canvas"
import { BlockItem } from "./components/BlockItem"
import { useWorkflowStore } from "./store/workflowStore"

export default function Home() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const { blocks, addBlock, moveBlock } = useWorkflowStore()

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && over.id === "canvas") {
      const blockType = active.data.current?.type
      if (blockType) {
        addBlock(blockType, { x: 100, y: 100 })
      }
    } else if (over && active.data.current?.isBlock) {
      const blockId = active.id as string
      const newPosition = {
        x: active.data.current.position.x + (event.delta.x || 0),
        y: active.data.current.position.y + (event.delta.y || 0),
      }
      moveBlock(blockId, newPosition)
    }

    setActiveId(null)
  }

  const activeBlock = activeId ? blocks.find((b) => b.id === activeId) : null

  return (
    <WorkflowProvider>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="h-screen flex flex-col bg-slate-50">
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <Canvas />
          </div>
        </div>

        <DragOverlay>{activeBlock && <BlockItem block={activeBlock} isDragging={true} />}</DragOverlay>
      </DndContext>
    </WorkflowProvider>
  )
}
