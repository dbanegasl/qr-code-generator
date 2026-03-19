import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { validateURL, validateEmail, validatePhone } from '@/lib/qr-utils'
import type { QRData, QRType } from '@/lib/types'
import { useState, useEffect } from 'react'

interface DataInputFormProps {
  type: QRType
  data: QRData
  onChange: (data: QRData) => void
}

export function DataInputForm({ type, data, onChange }: DataInputFormProps) {
  const [urlWarning, setUrlWarning] = useState<string | null>(null)

  useEffect(() => {
    if (type === 'url' && data.type === 'url') {
      const validation = validateURL(data.url)
      if (!validation.valid && validation.suggestion) {
        setUrlWarning(validation.suggestion)
      } else {
        setUrlWarning(null)
      }
    }
  }, [type, data])

  if (type === 'url' && data.type === 'url') {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="url" className="uppercase text-xs font-semibold tracking-wide">Website URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={data.url}
            onChange={(e) => onChange({ ...data, url: e.target.value })}
            className="font-mono h-9"
          />
          {urlWarning && (
            <Alert className="py-2">
              <AlertDescription className="text-xs">
                Did you mean <button 
                  onClick={() => onChange({ ...data, url: urlWarning })}
                  className="font-semibold text-accent hover:underline"
                >{urlWarning}</button>?
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    )
  }

  if (type === 'text' && data.type === 'text') {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="text" className="uppercase text-xs font-semibold tracking-wide">Text Content</Label>
          <Textarea
            id="text"
            placeholder="Enter any text..."
            value={data.text}
            onChange={(e) => onChange({ ...data, text: e.target.value })}
            className="font-mono min-h-24 resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">{data.text.length} / 500</p>
        </div>
      </div>
    )
  }

  if (type === 'wifi' && data.type === 'wifi') {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ssid" className="uppercase text-xs font-semibold tracking-wide">Network Name (SSID)</Label>
          <Input
            id="ssid"
            type="text"
            placeholder="MyWiFiNetwork"
            value={data.ssid}
            onChange={(e) => onChange({ ...data, ssid: e.target.value })}
            className="font-mono h-9"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="wifi-password" className="uppercase text-xs font-semibold tracking-wide">Password</Label>
          <Input
            id="wifi-password"
            type="text"
            placeholder="password123"
            value={data.password}
            onChange={(e) => onChange({ ...data, password: e.target.value })}
            className="font-mono h-9"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="encryption" className="uppercase text-xs font-semibold tracking-wide">Encryption</Label>
          <Select value={data.encryption} onValueChange={(value) => onChange({ ...data, encryption: value as 'WPA' | 'WEP' | 'nopass' })}>
            <SelectTrigger id="encryption" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WPA">WPA/WPA2</SelectItem>
              <SelectItem value="WEP">WEP</SelectItem>
              <SelectItem value="nopass">No Password</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Label htmlFor="hidden" className="uppercase text-xs font-semibold tracking-wide">Hidden Network</Label>
          <Switch
            id="hidden"
            checked={data.hidden}
            onCheckedChange={(checked) => onChange({ ...data, hidden: checked })}
          />
        </div>
      </div>
    )
  }

  if (type === 'email' && data.type === 'email') {
    const isValidEmail = data.email ? validateEmail(data.email) : true
    
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="uppercase text-xs font-semibold tracking-wide">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@example.com"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            className={`font-mono h-9 ${!isValidEmail ? 'border-destructive' : ''}`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="subject" className="uppercase text-xs font-semibold tracking-wide">Subject (Optional)</Label>
          <Input
            id="subject"
            type="text"
            placeholder="Email subject"
            value={data.subject}
            onChange={(e) => onChange({ ...data, subject: e.target.value })}
            className="h-9"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="body" className="uppercase text-xs font-semibold tracking-wide">Message (Optional)</Label>
          <Textarea
            id="body"
            placeholder="Email message"
            value={data.body}
            onChange={(e) => onChange({ ...data, body: e.target.value })}
            className="min-h-20 resize-none"
          />
        </div>
      </div>
    )
  }

  if (type === 'phone' && data.type === 'phone') {
    const isValidPhone = data.phone ? validatePhone(data.phone) : true
    
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone" className="uppercase text-xs font-semibold tracking-wide">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1234567890"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className={`font-mono h-9 ${!isValidPhone ? 'border-destructive' : ''}`}
          />
          <p className="text-xs text-muted-foreground">Include country code (e.g., +1)</p>
        </div>
      </div>
    )
  }

  if (type === 'sms' && data.type === 'sms') {
    const isValidPhone = data.phone ? validatePhone(data.phone) : true
    
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sms-phone" className="uppercase text-xs font-semibold tracking-wide">Phone Number</Label>
          <Input
            id="sms-phone"
            type="tel"
            placeholder="+1234567890"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className={`font-mono h-9 ${!isValidPhone ? 'border-destructive' : ''}`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="message" className="uppercase text-xs font-semibold tracking-wide">Message</Label>
          <Textarea
            id="message"
            placeholder="Text message content"
            value={data.message}
            onChange={(e) => onChange({ ...data, message: e.target.value })}
            className="min-h-20 resize-none"
          />
        </div>
      </div>
    )
  }

  return null
}
