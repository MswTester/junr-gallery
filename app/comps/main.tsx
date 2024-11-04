'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from 'next/link'
import { works } from '../data/fakedb'

export default function Gallery() {
  const galleryRef = useRef<HTMLDivElement>(null)

  return (
    <TooltipProvider>
      <div ref={galleryRef} className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          자의누리 갤러리
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work) => (
            <Link href={`/video/${work.id}`} passHref key={work.id}>
              <Card className="group relative overflow-hidden rounded-xl bg-black/30 backdrop-blur-sm border-0 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50">
                <CardContent className="p-0">
                  <img src={work.thumbnailUrl} alt={work.title} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <video
                      src={work.videoUrl}
                      className="w-full h-full object-cover"
                      loop
                      muted
                      playsInline
                      onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <h2 className="text-xl text-neutral-100 font-semibold mb-1">{work.title}</h2>
                      <p className="text-sm text-gray-300">{work.artist}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}