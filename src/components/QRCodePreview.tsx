import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import type { QRCustomization } from '@/lib/types'

interface QRCodePreviewProps {
  content: string
  customization: QRCustomization
}

export function QRCodePreview({ content, customization }: QRCodePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (customization.logoImage) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        setLogoImage(img)
      }
      img.onerror = () => {
        console.error('Failed to load logo image')
        setLogoImage(null)
      }
      img.src = customization.logoImage
    } else {
      setLogoImage(null)
    }
  }, [customization.logoImage])

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !content) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      try {
        await QRCode.toCanvas(canvas, content, {
          width: customization.size,
          margin: customization.margin,
          color: {
            dark: customization.foregroundColor,
            light: customization.backgroundColor,
          },
          errorCorrectionLevel: 'H',
        })

        if (customization.logoImage && logoImage) {
          const logoSize = customization.size * customization.logoScale
          const x = (customization.size - logoSize) / 2
          const y = (customization.size - logoSize) / 2

          const padding = 8
          ctx.fillStyle = customization.backgroundColor
          ctx.fillRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2)

          ctx.drawImage(logoImage, x, y, logoSize, logoSize)
        }
      } catch (error) {
        console.error('QR generation error:', error)
      }
    }

    generateQR()
  }, [content, customization, logoImage])

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
      className="w-full flex justify-center"
    >
      <canvas 
        ref={canvasRef}
        className="rounded-lg shadow-lg"
        style={{ maxWidth: '100%', height: 'auto', width: 'auto' }}
      />
    </motion.div>
  )
}
