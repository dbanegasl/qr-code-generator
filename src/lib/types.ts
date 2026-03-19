export type QRType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms'

export interface BaseQRData {
  type: QRType
}

export interface URLQRData extends BaseQRData {
  type: 'url'
  url: string
}

export interface TextQRData extends BaseQRData {
  type: 'text'
  text: string
}

export interface WiFiQRData extends BaseQRData {
  type: 'wifi'
  ssid: string
  password: string
  encryption: 'WPA' | 'WEP' | 'nopass'
  hidden: boolean
}

export interface EmailQRData extends BaseQRData {
  type: 'email'
  email: string
  subject: string
  body: string
}

export interface PhoneQRData extends BaseQRData {
  type: 'phone'
  phone: string
}

export interface SMSQRData extends BaseQRData {
  type: 'sms'
  phone: string
  message: string
}

export type QRData = URLQRData | TextQRData | WiFiQRData | EmailQRData | PhoneQRData | SMSQRData

export interface QRCustomization {
  foregroundColor: string
  backgroundColor: string
  size: number
  margin: number
  logoImage: string | null
  logoScale: number
}

export interface QRConfig {
  data: QRData
  customization: QRCustomization
  timestamp: number
}
