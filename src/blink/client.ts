import { createClient } from '@blinkdotnew/sdk'

// Main client for authenticated routes
export const blink = createClient({
  projectId: 'simplified-calendly-clone-729vvuw1',
  authRequired: true
})

// Public client for booking page (no auth required)
export const publicBlink = createClient({
  projectId: 'simplified-calendly-clone-729vvuw1',
  authRequired: false
})