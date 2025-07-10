"use client"

import { Play, Save, Download, Settings } from "lucide-react"
import { useWorkflowStore } from "../store/workflowStore"

export function Navbar() {
  const { executeWorkflow, saveWorkflow } = useWorkflowStore()

  return (
    <nav className="bg-white border-b border-sky-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-sky-900">AI Workflow Builder</h1>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={executeWorkflow}
          className="flex items-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Play size={16} />
          <span>Run Workflow</span>
        </button>

        <button
          onClick={saveWorkflow}
          className="flex items-center space-x-2 bg-sky-100 hover:bg-sky-200 text-sky-700 px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Save size={16} />
          <span>Save</span>
        </button>

        <button className="flex items-center space-x-2 bg-sky-100 hover:bg-sky-200 text-sky-700 px-4 py-2 rounded-lg transition-colors duration-200">
          <Download size={16} />
          <span>Export</span>
        </button>

        <button className="flex items-center space-x-2 bg-sky-100 hover:bg-sky-200 text-sky-700 px-4 py-2 rounded-lg transition-colors duration-200">
          <Settings size={16} />
        </button>
      </div>
    </nav>
  )
}
