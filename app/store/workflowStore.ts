"use client"

import { create } from "zustand"
import type { Block, WorkflowState } from "../types/workflow"

interface WorkflowStore extends WorkflowState {
  addBlock: (type: string, position: { x: number; y: number }) => void
  updateBlock: (id: string, updates: Partial<Block>) => void
  deleteBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  moveBlock: (id: string, position: { x: number; y: number }) => void
  runBlock: (id: string) => Promise<void>
  executeWorkflow: () => Promise<void>
  saveWorkflow: () => void
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  blocks: [],
  connections: [],
  isExecuting: false,

  addBlock: (type, position) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position,
      content: "",
      output: "",
      isLoading: false,
    }

    set((state) => ({
      blocks: [...state.blocks, newBlock],
    }))
  },

  updateBlock: (id, updates) => {
    set((state) => ({
      blocks: state.blocks.map((block) => (block.id === id ? { ...block, ...updates } : block)),
    }))
  },

  deleteBlock: (id) => {
    set((state) => ({
      blocks: state.blocks.filter((block) => block.id !== id),
    }))
  },

  duplicateBlock: (id) => {
    const { blocks } = get()
    const blockToDuplicate = blocks.find((block) => block.id === id)

    if (blockToDuplicate) {
      const newBlock: Block = {
        ...blockToDuplicate,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: {
          x: blockToDuplicate.position.x + 20,
          y: blockToDuplicate.position.y + 20,
        },
        output: "",
        isLoading: false,
      }

      set((state) => ({
        blocks: [...state.blocks, newBlock],
      }))
    }
  },

  moveBlock: (id, position) => {
    set((state) => ({
      blocks: state.blocks.map((block) => (block.id === id ? { ...block, position } : block)),
    }))
  },

  runBlock: async (id) => {
    const { updateBlock } = get()
    const block = get().blocks.find((b) => b.id === id)

    if (!block || !block.content) return

    updateBlock(id, { isLoading: true, output: "" })

    try {
      const response = await fetch("/api/runBlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockId: id,
          type: block.type,
          content: block.content,
        }),
      })

      const data = await response.json()

      if (data.success) {
        updateBlock(id, { output: data.output, isLoading: false })
      } else {
        updateBlock(id, { output: `Error: ${data.error}`, isLoading: false })
      }
    } catch (error) {
      updateBlock(id, {
        output: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        isLoading: false,
      })
    }
  },

  executeWorkflow: async () => {
    const { blocks } = get()
    set({ isExecuting: true })

    try {
      const response = await fetch("/api/executeFlow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks }),
      })

      const data = await response.json()
      console.log("Workflow executed:", data)
    } catch (error) {
      console.error("Workflow execution failed:", error)
    } finally {
      set({ isExecuting: false })
    }
  },

  saveWorkflow: () => {
    const { blocks, connections } = get()
    const workflow = { blocks, connections }
    localStorage.setItem("workflow", JSON.stringify(workflow))
    console.log("Workflow saved to localStorage")
  },
}))
