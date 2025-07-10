"use client"

import type { ReactNode } from "react"

interface WorkflowProviderProps {
  children: ReactNode
}

export function WorkflowProvider({ children }: WorkflowProviderProps) {
  return <>{children}</>
}
