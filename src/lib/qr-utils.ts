import type { QRData, WiFiQRData, EmailQRData, SMSQRData } from './types'

export function formatQRContent(data: QRData): string {
  switch (data.type) {
    case 'url':
      return data.url
    
    case 'text':
      return data.text
    
    case 'wifi': {
      const wifi = data as WiFiQRData
      const escapedSSID = escapeWiFiString(wifi.ssid)
      const escapedPassword = escapeWiFiString(wifi.password)
      return `WIFI:T:${wifi.encryption};S:${escapedSSID};P:${escapedPassword};H:${wifi.hidden};`
    }
    
    case 'email': {
      const email = data as EmailQRData
      const subject = encodeURIComponent(email.subject)
      const body = encodeURIComponent(email.body)
      return `mailto:${email.email}?subject=${subject}&body=${body}`
    }
    
    case 'phone':
      return `tel:${data.phone}`
    
    case 'sms': {
      const sms = data as SMSQRData
      return `sms:${sms.phone}?body=${encodeURIComponent(sms.message)}`
    }
    
    default:
      return ''
  }
}

function escapeWiFiString(str: string): string {
  return str.replace(/([\\;,":])/g, '\\$1')
}

export function validateURL(url: string): { valid: boolean; suggestion?: string } {
  if (!url) return { valid: false }
  
  try {
    new URL(url)
    return { valid: true }
  } catch {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return { valid: false, suggestion: `https://${url}` }
    }
    return { valid: false }
  }
}

export function validateEmail(email: string): boolean {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  if (!phone) return false
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  return /^\+?\d{7,15}$/.test(cleanPhone)
}

export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1)
  const l2 = getRelativeLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function getRelativeLuminance(color: string): number {
  const rgb = hexToRgb(color)
  if (!rgb) return 0
  
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(val => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}
