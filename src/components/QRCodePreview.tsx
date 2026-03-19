import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import type { QRCustomization } from '@/lib/types'

interface QRCodePreviewProps {
  content: string
  customization: QRCustomization
}

export function QRCodePreview({ content, customization }: QRCodePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const logoRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !content) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    QRCode.toCanvas(canvas, content, {
      width: customization.size,
      margin: customization.margin,
      color: {
        dark: customization.foregroundColor,
        light: customization.backgroundColor,
      },
      errorCorrectionLevel: 'H',
    }, (error) => {
      if (error) {
        console.error('QR generation error:', error)
        return
      }

      if (customization.logoImage && logoRef.current) {
        const logo = logoRef.current
        const logoSize = customization.size * customization.logoScale
        const x = (customization.size - logoSize) / 2
        const y = (customization.size - logoSize) / 2

        ctx.fillStyle = customization.backgroundColor
        ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8)

        ctx.drawImage(logo, x, y, logoSize, logoSize)
      }
    })
  }, [content, customization])

  useEffect(() => {
    if (customization.logoImage) {
      const img = new Image()
      img.onload = () => {
        logoRef.current = img
        if (canvasRef.current) {
          const event = new Event('logoLoaded')
          canvasRef.current.dispatchEvent(event)
        }
      }
      img.src = customization.logoImage
    } else {
      logoRef.current = null
    }
  }, [customization.logoImage])

  if (!content) {
    return (
      <div 
        className="flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-border"
        style={{ width: customization.size, height: customization.size }}
      >
        <p className="text-muted-foreground text-sm">Enter data to generate QR</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <canvas 
        ref={canvasRef}
        className="rounded-lg shadow-lg"
      />
    </motion.div>
  )
}
