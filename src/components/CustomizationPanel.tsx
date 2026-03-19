import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Palette, Image as ImageIcon } from '@phosphor-icons/react'
import { useState, useRef } from 'react'
import type { QRCustomization } from '@/lib/types'
import { getContrastRatio } from '@/lib/qr-utils'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CustomizationPanelProps {
  customization: QRCustomization
  onChange: (customization: QRCustomization) => void
}

export function CustomizationPanel({ customization, onChange }: CustomizationPanelProps) {
  const [logoEnabled, setLogoEnabled] = useState(!!customization.logoImage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoToggle = (enabled: boolean) => {
    setLogoEnabled(enabled)
    if (!enabled) {
      onChange({ ...customization, logoImage: null })
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        onChange({ ...customization, logoImage: result })
      }
    }
    reader.readAsDataURL(file)
  }

  const contrastRatio = getContrastRatio(
    customization.foregroundColor,
    customization.backgroundColor
  )
  const hasLowContrast = contrastRatio < 3

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wide mb-4">Colors</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="fg-color" className="text-xs uppercase tracking-wide">Foreground</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <div 
                    className="w-5 h-5 rounded border border-border"
                    style={{ backgroundColor: customization.foregroundColor }}
                  />
                  <Palette size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <input
                  id="fg-color"
                  type="color"
                  value={customization.foregroundColor}
                  onChange={(e) => onChange({ ...customization, foregroundColor: e.target.value })}
                  className="w-32 h-32 cursor-pointer border-0 p-0"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="bg-color" className="text-xs uppercase tracking-wide">Background</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <div 
                    className="w-5 h-5 rounded border border-border"
                    style={{ backgroundColor: customization.backgroundColor }}
                  />
                  <Palette size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <input
                  id="bg-color"
                  type="color"
                  value={customization.backgroundColor}
                  onChange={(e) => onChange({ ...customization, backgroundColor: e.target.value })}
                  className="w-32 h-32 cursor-pointer border-0 p-0"
                />
              </PopoverContent>
            </Popover>
          </div>

          {hasLowContrast && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">
                Low contrast may reduce scannability
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wide mb-4">Size & Margin</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wide">QR Size</Label>
              <span className="text-xs font-mono text-muted-foreground">{customization.size}px</span>
            </div>
            <Slider
              value={[customization.size]}
              onValueChange={([value]) => onChange({ ...customization, size: value })}
              min={200}
              max={600}
              step={50}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wide">Quiet Zone</Label>
              <span className="text-xs font-mono text-muted-foreground">{customization.margin}</span>
            </div>
            <Slider
              value={[customization.margin]}
              onValueChange={([value]) => onChange({ ...customization, margin: value })}
              min={0}
              max={8}
              step={1}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide">Center Logo</h3>
          <Switch
            checked={logoEnabled}
            onCheckedChange={handleLogoToggle}
          />
        </div>

        {logoEnabled && (
          <div className="flex flex-col gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            
            {customization.logoImage ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={customization.logoImage} 
                    alt="Logo preview"
                    className="w-12 h-12 object-contain rounded border border-border"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Logo
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs uppercase tracking-wide">Logo Scale</Label>
                    <span className="text-xs font-mono text-muted-foreground">
                      {Math.round(customization.logoScale * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[customization.logoScale]}
                    onValueChange={([value]) => onChange({ ...customization, logoScale: value })}
                    min={0.1}
                    max={0.3}
                    step={0.05}
                  />
                  {customization.logoScale > 0.25 && (
                    <p className="text-xs text-muted-foreground">
                      Large logos may reduce scannability
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={18} />
                Upload Logo
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
