export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}

export async function ensureServiceWorker() {
  if (!('serviceWorker' in navigator)) throw new Error('Service worker not supported')
  const reg = await navigator.serviceWorker.ready
  return reg
}

export async function subscribePush() {
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error('Permission denied')
  const reg = await ensureServiceWorker()
  const pubKeyRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/push/public-key`)
  const { key } = await pubKeyRes.json()
  if (!key) throw new Error('No VAPID key on server')
  const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) })
  await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/push/subscribe`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}) }, body: JSON.stringify(sub) })
  return sub
}

export async function unsubscribePush() {
  const reg = await ensureServiceWorker()
  const sub = await reg.pushManager.getSubscription()
  if (sub) {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/push/unsubscribe`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint }) })
    await sub.unsubscribe()
    return true
  }
  return false
}

