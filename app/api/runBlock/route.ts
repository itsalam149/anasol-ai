import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { blockId, type, content } = await request.json()

    if (!content) {
      return NextResponse.json({
        success: false,
        error: "No content provided",
      })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    let prompt = ""

    // Customize prompt based on block type
    switch (type) {
      case "text-prompt":
        prompt = content
        break
      case "image-generator":
        prompt = `Create a detailed description for an image based on: ${content}`
        break
      case "code-generator":
        prompt = `Generate code for the following requirement: ${content}`
        break
      case "text-analyzer":
        prompt = `Analyze the following text and provide insights: ${content}`
        break
      case "transformer":
        prompt = `Transform the following content: ${content}`
        break
      case "ai-agent":
        prompt = `Act as an AI agent and respond to: ${content}`
        break
      default:
        prompt = content
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const output = response.text()

    return NextResponse.json({
      success: true,
      output,
      blockId,
    })
  } catch (error) {
    console.error("Error running block:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}
