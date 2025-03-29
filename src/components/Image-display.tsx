import Image from "next/image"

interface ImageDisplayProps {
  src: string
  alt: string
}

export default function ImageDisplay({ src, alt }: ImageDisplayProps) {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl">
      <div className="w-[512px] h-[512px] relative">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 512px"
          priority
        />
      </div>
      <div className="absolute inset-0 ring-1 ring-white/10 rounded-lg pointer-events-none"></div>
    </div>
  )
}

