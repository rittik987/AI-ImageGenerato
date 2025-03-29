"use client"

import { useState } from "react"
import { Slider } from "../components/ui/Slider"
import { Label } from "../components/ui/Label"
import { Switch } from "../components/ui/Switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select"
import { Separator } from "../components/ui/Separator"
import { Badge } from "../components/ui/Badge"
import { Wand2, Layers, Sparkles, Palette, Maximize2 } from "lucide-react"

// Define prop types for clarity
interface Settings {
  width: number
  height: number
  steps: number
  guidance: number
  seed: number
  enhancePrompt: boolean
  model: string
  style: string
}

interface SettingsPanelProps {
  settings: Settings
  setSettings: (settings: Settings) => void
}

export default function SettingsPanel({ settings, setSettings }: SettingsPanelProps) {
  const handleSliderChange = (name: string, value: number[]) => {
    setSettings({ ...settings, [name]: value[0] })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({ ...settings, [name]: checked })
  }

  const handleSelectChange = (name: string, value: string) => {
    setSettings({ ...settings, [name]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Maximize2 className="h-4 w-4 text-purple-300" />
          <h3 className="font-medium">Dimensions</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label>Width</Label>
              <Badge variant="outline">{settings.width}px</Badge>
            </div>
            <Slider
              value={[settings.width]}
              min={256}
              max={1024}
              step={64}
              onValueChange={(value) => handleSliderChange("width", value)}
              className="my-1"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <Label>Height</Label>
              <Badge variant="outline">{settings.height}px</Badge>
            </div>
            <Slider
              value={[settings.height]}
              min={256}
              max={1024}
              step={64}
              onValueChange={(value) => handleSliderChange("height", value)}
              className="my-1"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Wand2 className="h-4 w-4 text-purple-300" />
          <h3 className="font-medium">Generation Parameters</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label>Steps</Label>
              <Badge variant="outline">{settings.steps}</Badge>
            </div>
            <Slider
              value={[settings.steps]}
              min={10}
              max={50}
              step={1}
              onValueChange={(value) => handleSliderChange("steps", value)}
              className="my-1"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <Label>Guidance Scale</Label>
              <Badge variant="outline">{settings.guidance}</Badge>
            </div>
            <Slider
              value={[settings.guidance]}
              min={1}
              max={20}
              step={0.5}
              onValueChange={(value) => handleSliderChange("guidance", value)}
              className="my-1"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <Label>Seed</Label>
              <Badge variant="outline">{settings.seed === -1 ? "Random" : settings.seed}</Badge>
            </div>
            <Slider
              value={[settings.seed === -1 ? 0 : settings.seed]}
              min={0}
              max={1000000}
              step={1}
              onValueChange={(value) => handleSliderChange("seed", value[0] === 0 ? [-1] : value)}
              className="my-1"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4 text-purple-300" />
          <h3 className="font-medium">Model</h3>
        </div>
        <Select value={settings.model} onValueChange={(value) => handleSelectChange("model", value)}>
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stable-diffusion-xl">Stable Diffusion XL</SelectItem>
            <SelectItem value="midjourney-v5">Midjourney v5</SelectItem>
            <SelectItem value="dalle-3">DALL-E 3</SelectItem>
            <SelectItem value="sdxl-turbo">SDXL Turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-white/10" />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="h-4 w-4 text-purple-300" />
          <h3 className="font-medium">Style</h3>
        </div>
        <Select value={settings.style} onValueChange={(value) => handleSelectChange("style", value)}>
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="photorealistic">Photorealistic</SelectItem>
            <SelectItem value="anime">Anime</SelectItem>
            <SelectItem value="digital-art">Digital Art</SelectItem>
            <SelectItem value="oil-painting">Oil Painting</SelectItem>
            <SelectItem value="3d-render">3D Render</SelectItem>
            <SelectItem value="pixel-art">Pixel Art</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-white/10" />

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-purple-300" />
          <h3 className="font-medium">Advanced</h3>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="enhance-prompt">Enhance Prompt</Label>
          <Switch
            id="enhance-prompt"
            checked={settings.enhancePrompt}
            onCheckedChange={(checked) => handleSwitchChange("enhancePrompt", checked)}
          />
        </div>
      </div>
    </div>
  )
}
