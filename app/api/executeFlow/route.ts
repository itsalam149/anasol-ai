import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { blocks } = await request.json()

    if (!blocks || blocks.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No blocks provided",
      })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create a workflow prompt by combining all blocks
    const workflowPrompt = blocks
      .filter((block: any) => block.content)
      .map((block: any, index: number) => `Step ${index + 1} (${block.type}): ${block.content}`)
      .join("\n\n")

    const fullPrompt = `Execute the following workflow step by step:\n\n${workflowPrompt}\n\nProvide a comprehensive result that addresses all steps.`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const output = response.text()

    return NextResponse.json({
      success: true,
      output,
      executedBlocks: blocks.length,
    })
  } catch (error) {
    console.error("Error executing workflow:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}
