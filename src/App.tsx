import { useState, useEffect, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Toaster, toast } from 'sonner'
import { 
  LinkSimple, 
  TextAa, 
  WifiHigh, 
  Envelope, 
  Phone, 
  ChatCircleText,
  DownloadSimple,
  ClockCounterClockwise 
} from '@phosphor-icons/react'
import { QRCodePreview } from '@/components/QRCodePreview'
import { DataInputForm } from '@/components/DataInputForm'
import { CustomizationPanel } from '@/components/CustomizationPanel'
import { formatQRContent } from '@/lib/qr-utils'
import type { QRData, QRType, QRCustomization, QRConfig } from '@/lib/types'

const defaultCustomization: QRCustomization = {
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  size: 400,
  margin: 4,
  logoImage: null,
  logoScale: 0.2,
}

function App() {
  const [activeType, setActiveType] = useState<QRType>('url')
  const [qrData, setQrData] = useState<QRData>({
    type: 'url',
    url: '',
  })
  const [customization, setCustomization] = useState<QRCustomization>(defaultCustomization)
  const [history, setHistory] = useKV<QRConfig[]>('qr-history', [])

  useEffect(() => {
    switch (activeType) {
      case 'url':
        setQrData({ type: 'url', url: '' })
        break
      case 'text':
        setQrData({ type: 'text', text: '' })
        break
      case 'wifi':
        setQrData({ type: 'wifi', ssid: '', password: '', encryption: 'WPA', hidden: false })
        break
      case 'email':
        setQrData({ type: 'email', email: '', subject: '', body: '' })
        break
      case 'phone':
        setQrData({ type: 'phone', phone: '' })
        break
      case 'sms':
        setQrData({ type: 'sms', phone: '', message: '' })
        break
    }
  }, [activeType])

  const qrContent = useMemo(() => {
    return formatQRContent(qrData)
  }, [qrData])

  const canDownload = useMemo(() => {
    return qrContent.length > 0
  }, [qrContent])

  const handleDownload = () => {
    if (!canDownload) return

    const canvas = document.querySelector('canvas')
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qr-code-${activeType}-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)

      const config: QRConfig = {
        data: qrData,
        customization,
        timestamp: Date.now(),
      }
      setHistory((current) => {
        const currentHistory = current || []
        return [config, ...currentHistory].slice(0, 10)
      })

      toast.success('QR code downloaded!')
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      
      <div className="container max-w-7xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
            QR Generator
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Create custom QR codes for links, WiFi, contacts, and more
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6 md:gap-8">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg uppercase tracking-wide">QR Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeType} onValueChange={(value) => setActiveType(value as QRType)}>
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full gap-2">
                    <TabsTrigger value="url" className="gap-2">
                      <LinkSimple size={18} />
                      <span className="hidden sm:inline">URL</span>
                    </TabsTrigger>
                    <TabsTrigger value="text" className="gap-2">
                      <TextAa size={18} />
                      <span className="hidden sm:inline">Text</span>
                    </TabsTrigger>
                    <TabsTrigger value="wifi" className="gap-2">
                      <WifiHigh size={18} />
                      <span className="hidden sm:inline">WiFi</span>
                    </TabsTrigger>
                    <TabsTrigger value="email" className="gap-2">
                      <Envelope size={18} />
                      <span className="hidden sm:inline">Email</span>
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="gap-2">
                      <Phone size={18} />
                      <span className="hidden sm:inline">Phone</span>
                    </TabsTrigger>
                    <TabsTrigger value="sms" className="gap-2">
                      <ChatCircleText size={18} />
                      <span className="hidden sm:inline">SMS</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    {(['url', 'text', 'wifi', 'email', 'phone', 'sms'] as QRType[]).map((type) => (
                      <TabsContent key={type} value={type} className="mt-0">
                        <DataInputForm
                          type={type}
                          data={qrData}
                          onChange={setQrData}
                        />
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="lg:hidden">
              <CardHeader>
                <CardTitle className="text-lg uppercase tracking-wide">Preview</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <QRCodePreview
                  content={qrContent}
                  customization={customization}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="hidden lg:block">
              <CardHeader>
                <CardTitle className="text-lg uppercase tracking-wide">Preview</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <QRCodePreview
                  content={qrContent}
                  customization={customization}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg uppercase tracking-wide">Customize</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomizationPanel
                  customization={customization}
                  onChange={setCustomization}
                />
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="w-full gap-2 font-semibold tracking-wide"
              onClick={handleDownload}
              disabled={!canDownload}
            >
              <DownloadSimple size={20} weight="bold" />
              Download QR Code
            </Button>

            {history && history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg uppercase tracking-wide flex items-center gap-2">
                    <ClockCounterClockwise size={20} />
                    Recent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {history.slice(0, 3).map((config, index) => (
                      <button
                        key={config.timestamp}
                        onClick={() => {
                          setActiveType(config.data.type)
                          setQrData(config.data)
                          setCustomization(config.customization)
                          toast.success('Configuration loaded')
                        }}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left"
                      >
                        <div className="text-2xl">
                          {config.data.type === 'url' && <LinkSimple />}
                          {config.data.type === 'text' && <TextAa />}
                          {config.data.type === 'wifi' && <WifiHigh />}
                          {config.data.type === 'email' && <Envelope />}
                          {config.data.type === 'phone' && <Phone />}
                          {config.data.type === 'sms' && <ChatCircleText />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold uppercase tracking-wide">
                            {config.data.type}
                          </p>
                          <p className="text-xs text-muted-foreground truncate font-mono">
                            {formatQRContent(config.data).slice(0, 40)}...
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App