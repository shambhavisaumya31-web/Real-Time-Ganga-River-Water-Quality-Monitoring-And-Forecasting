self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  if (!event.data) return
  let data = {}
  try { data = event.data.json() } catch { data = { title: 'Notification', body: event.data.text() } }
  const title = data.title || 'Notification'
  const body = data.body || ''
  const options = { body, icon: '/icons/icon-192.png', data }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = '/' // could be enhanced to deep link by data
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientsArr) => {
      const hadWindow = clientsArr.some((client) => {
        if (client.url.includes(self.location.origin) && 'focus' in client) { client.focus(); return true }
        return false
      })
      if (!hadWindow && self.clients.openWindow) return self.clients.openWindow(url)
    })
  )
})

