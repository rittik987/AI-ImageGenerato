"use client"

import Image from "next/image"

interface HistoryImage {
  id: string
  url: string
  prompt: string
}

interface ImageHistoryProps {
  images: HistoryImage[]
  onSelect: (image: HistoryImage) => void
}

export default function ImageHistory({ images, onSelect }: ImageHistoryProps) {
  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/50">
        <p>No images generated yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative group cursor-pointer rounded-lg overflow-hidden"
          onClick={() => onSelect(image)}
        >
          <div className="aspect-square relative">
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.prompt}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 200px"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
            <p className="text-xs line-clamp-2">{image.prompt}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

