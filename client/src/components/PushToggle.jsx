import { useEffect, useState } from 'react'
import { subscribePush, unsubscribePush, ensureServiceWorker } from '../push'

export default function PushToggle() {
  const [supported, setSupported] = useState(true)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) { setSupported(false); return }
    ensureServiceWorker().then(async (reg) => {
      const sub = await reg.pushManager.getSubscription()
      setSubscribed(!!sub)
    }).catch(() => setSupported(false))
  }, [])

  if (!supported) return null

  const onClick = async () => {
    try {
      if (!subscribed) { await subscribePush(); setSubscribed(true) }
      else { await unsubscribePush(); setSubscribed(false) }
    } catch (e) {
      alert('Push failed: ' + (e?.message || ''))
    }
  }

  return (
    <button className="btn secondary" onClick={onClick} style={{ marginLeft: 8 }}>
      {subscribed ? 'Disable Push' : 'Enable Push'}
    </button>
  )
}

