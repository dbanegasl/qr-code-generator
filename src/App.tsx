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
  ClockCounterClockwise,
  Sparkle
} from '@phosphor-icons/react'
import { QRCodePreview } from '@/components/QRCodePreview'
import { DataInputForm } from '@/components/DataInputForm'
import { CustomizationPanel } from '@/components/CustomizationPanel'
import { formatQRContent } from '@/lib/qr-utils'
import type { QRData, QRType, QRCustomization, QRConfig } from '@/lib/types'

const defaultCustomization: QRCustomization = {
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  size: 300,
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
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [isGenerated, setIsGenerated] = useState(false)

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
    setIsGenerated(false)
  }, [activeType])

  useEffect(() => {
    setIsGenerated(false)
  }, [qrData, customization])

  const qrContent = useMemo(() => {
    return formatQRContent(qrData)
  }, [qrData])

  const canGenerate = useMemo(() => {
    return qrContent.length > 0
  }, [qrContent])

  const handleGenerate = () => {
    if (!canGenerate) return
    setGeneratedContent(qrContent)
    setIsGenerated(true)
    toast.success('QR Code generado!')
  }

  const handleDownload = () => {
    if (!isGenerated) return

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

      toast.success('QR descargado!')
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <div className="container max-w-5xl mx-auto px-4 py-6 md:py-8">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1" style={{ letterSpacing: '-0.02em' }}>
            QR Generator
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Create custom QR codes for links, WiFi, contacts, and more
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase tracking-wide">QR TYPE</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <Tabs value={activeType} onValueChange={(value) => setActiveType(value as QRType)}>
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full h-auto gap-1.5 p-1">
                    <TabsTrigger value="url" className="gap-1.5 px-2 py-1.5 text-xs">
                      <LinkSimple size={16} />
                      <span className="hidden sm:inline">URL</span>
                    </TabsTrigger>
                    <TabsTrigger value="text" className="gap-1.5 px-2 py-1.5 text-xs">
                      <TextAa size={16} />
                      <span className="hidden sm:inline">Text</span>
                    </TabsTrigger>
                    <TabsTrigger value="wifi" className="gap-1.5 px-2 py-1.5 text-xs">
                      <WifiHigh size={16} />
                      <span className="hidden sm:inline">WiFi</span>
                    </TabsTrigger>
                    <TabsTrigger value="email" className="gap-1.5 px-2 py-1.5 text-xs">
                      <Envelope size={16} />
                      <span className="hidden sm:inline">Email</span>
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="gap-1.5 px-2 py-1.5 text-xs">
                      <Phone size={16} />
                      <span className="hidden sm:inline">Phone</span>
                    </TabsTrigger>
                    <TabsTrigger value="sms" className="gap-1.5 px-2 py-1.5 text-xs">
                      <ChatCircleText size={16} />
                      <span className="hidden sm:inline">SMS</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-4">
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

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase tracking-wide">CUSTOMIZE</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <CustomizationPanel
                  customization={customization}
                  onChange={setCustomization}
                />
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="w-full gap-2 font-semibold tracking-wide"
              onClick={handleGenerate}
              disabled={!canGenerate}
            >
              <Sparkle size={20} weight="bold" />
              Generar QR Code
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {isGenerated ? (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm uppercase tracking-wide">
                      QR Code <span className="text-muted-foreground font-normal text-xs normal-case">preview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center pb-4">
                    <QRCodePreview
                      content={generatedContent}
                      customization={customization}
                    />
                  </CardContent>
                </Card>

                <Button
                  size="lg"
                  variant="default"
                  className="w-full gap-2 font-semibold tracking-wide"
                  onClick={handleDownload}
                >
                  <DownloadSimple size={20} weight="bold" />
                  Descargar QR Code
                </Button>
              </>
            ) : (
              <Card className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Sparkle size={32} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Configure los datos y haga clic en <span className="font-semibold">Generar</span>
                  </p>
                </div>
              </Card>
            )}

            {history && history.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm uppercase tracking-wide flex items-center gap-2">
                    <ClockCounterClockwise size={18} />
                    Recent
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex flex-col gap-2">
                    {history.slice(0, 3).map((config) => (
                      <button
                        key={config.timestamp}
                        onClick={() => {
                          setActiveType(config.data.type)
                          setQrData(config.data)
                          setCustomization(config.customization)
                          setIsGenerated(false)
                          toast.success('Configuración cargada')
                        }}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left"
                      >
                        <div className="text-xl">
                          {config.data.type === 'url' && <LinkSimple />}
                          {config.data.type === 'text' && <TextAa />}
                          {config.data.type === 'wifi' && <WifiHigh />}
                          {config.data.type === 'email' && <Envelope />}
                          {config.data.type === 'phone' && <Phone />}
                          {config.data.type === 'sms' && <ChatCircleText />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide">
                            {config.data.type}
                          </p>
                          <p className="text-xs text-muted-foreground truncate font-mono">
                            {formatQRContent(config.data).slice(0, 35)}...
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
  );
}

export default App