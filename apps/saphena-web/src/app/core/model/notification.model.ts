export interface WhatsAppClientStatus {
  clientId: string,
  connected: boolean,
  info?: WhatsAppClientInfo,
  state?: string,
  success: boolean,
  timestamp: string
}

export interface WhatsAppClientInfo {
  pushname: string,
  platform: string,
  me: {
    user: string
  }
}
