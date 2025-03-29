"use client"

import { useState, useEffect } from "react"
import { Download, Settings, Sparkles, XCircle } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import ImageDisplay from "../components/Image-display"
import CustomLoader from "../components/CustomLoader"
import SettingsPanel from "../components/Setting-panel"
import ImageHistory from "../components/Image-history"

// Types for images
interface HistoryImage {
  id: string
  url: string  // Now stored as a Base64 string
  prompt: string
}

// Helper: Convert Blob to Base64 string
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  // Track which tab is active: "prompt" or "history"
  const [activeTab, setActiveTab] = useState("prompt")

  // Image history state
  const [imageHistory, setImageHistory] = useState<HistoryImage[]>([])

  // Lifted settings state for generation
  const [settings, setSettings] = useState({
    width: 512,
    height: 512,
    steps: 30,
    guidance: 7.5,
    seed: -1,
    enhancePrompt: true,
    model: "stable-diffusion-xl",
    style: "photorealistic",
  })

  // For full-screen modal when clicking an image
  const [modalImage, setModalImage] = useState<HistoryImage | null>(null)

  // Load history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("imageHistory")
    if (storedHistory) {
      setImageHistory(JSON.parse(storedHistory))
    }
  }, [])

  // Save history to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("imageHistory", JSON.stringify(imageHistory))
  }, [imageHistory])

  // API call using Hugging Face Inference endpoint.
  async function query(data: any) {
    const apiKey = process.env.NEXT_PUBLIC_HF_API_KEY
    if (!apiKey) {
      throw new Error("API key is missing. Please add it to your .env.local file.")
    }
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(data),
      }
    )
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText} - ${errorText}`
      )
    }
    return await response.blob()
  }

  // Generate image via the API call using prompt and settings,
  // then convert the blob to a Base64 string.
  const generateImage = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGeneratedImage(null)

    try {
      // Build payload with prompt and settings parameters.
      const payload = {
        inputs: prompt,
        parameters: {
          width: settings.width,
          height: settings.height,
          num_inference_steps: settings.steps,
          guidance_scale: settings.guidance,
          ...(settings.seed !== -1 && { seed: settings.seed }),
        },
        options: { wait_for_model: true },
      }

      const responseBlob = await query(payload)
      if (responseBlob) {
        const base64Image = await blobToBase64(responseBlob)
        setGeneratedImage(base64Image)
        const newImage: HistoryImage = {
          id: Date.now().toString(),
          url: base64Image,
          prompt: prompt,
        }
        // Add new image to history (at the front)
        setImageHistory((prev) => [newImage, ...prev])
        // Auto-switch to the History tab
        setActiveTab("history")
      } else {
        throw new Error("Failed to generate the image. Please try again.")
      }
    } catch (error: any) {
      console.error("Error generating image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle user clicking an image in the history (to open modal)
  const handleHistorySelect = (img: HistoryImage) => {
    setModalImage(img)
  }

  // Close the modal
  const handleCloseModal = () => {
    console.log("Close modal clicked")
    setModalImage(null)
  }

  // Download image function for the modal
  const handleDownload = (url: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = `ai-generated-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Delete image from history and close modal
  const handleDelete = (id: string) => {
    setImageHistory((prev) => prev.filter((item) => item.id !== id))
    setModalImage(null)
  }

  return (
    <main className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white overflow-hidden relative">
      {/* Left sidebar – Settings */}
      <div className="w-1/4 border-r border-white/10 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-5 w-5" />
          <h2 className="text-xl font-bold">Generation Settings</h2>
        </div>
        <SettingsPanel settings={settings} setSettings={setSettings} />
      </div>

      {/* Right side: Tabs for Prompt & History */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          {/* Tab Headers */}
          <div className="border-b border-white/10 bg-black/20 backdrop-blur-md px-6 pt-4">
            <TabsList className="bg-white/10">
              <TabsTrigger value="prompt">Prompt</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
          </div>

          {/* Prompt Tab */}
          <TabsContent value="prompt" className="flex-1 overflow-auto p-6">
            <div className="max-w-xl mx-auto">
              {isGenerating && (
                <div className="flex items-center justify-center mb-4">
                  <CustomLoader />
                </div>
              )}
              {/* Display placeholder only when not generating */}
              {!isGenerating && (
                <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-md mb-6">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-purple-300" />
                  <h3 className="text-2xl font-bold mb-2">Create Amazing AI Art</h3>
                  <p className="text-white/70">
                    Enter a prompt below and click Generate to create your masterpiece
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/50 p-4"
                />
                <Button
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  {isGenerating ? "Generating..." : "Generate"}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="flex-1 overflow-auto p-6">
            <ImageHistory images={imageHistory} onSelect={handleHistorySelect} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal for full-screen image display */}
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-3xl max-h-[90vh] p-4 flex flex-col items-center">
            {/* Close Button with inline styles to ensure clickability */}
            <button
              onClick={handleCloseModal}
              style={{ pointerEvents: "auto", zIndex: 1000 }}
              className="absolute top-4 right-4 text-white hover:text-gray-200"
            >
              <XCircle className="h-8 w-8" />
            </button>

            {/* Display the clicked image */}
            <div className="mb-4 w-full flex-1 relative flex items-center justify-center overflow-hidden">
              <ImageDisplay src={modalImage.url} alt={modalImage.prompt} />
            </div>

            {/* Prompt text */}
            <p className="text-sm text-center text-white/80 mb-4">
              Prompt: {modalImage.prompt}
            </p>

            {/* Download & Delete Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleDownload(modalImage.url)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(modalImage.id)}
                className="gap-2"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
