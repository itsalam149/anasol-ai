export interface Block {
  id: string
  type: string
  position: { x: number; y: number }
  content: string
  output?: string
  isLoading?: boolean
}

export interface Connection {
  id: string
  sourceId: string
  targetId: string
}

export interface WorkflowState {
  blocks: Block[]
  connections: Connection[]
  isExecuting: boolean
}
