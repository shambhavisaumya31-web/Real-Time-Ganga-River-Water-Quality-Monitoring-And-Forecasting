import { useEffect, useRef, useState } from 'react'
import api from '../api'

export default function ChatbotWidget() {
  const [open, setOpen] = useState(true)
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi! Ask me about DO, BOD, nitrate, fecal coliform, or how to report.' }])
  const [input, setInput] = useState('')
  const bodyRef = useRef(null)

  useEffect(() => {
    bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight)
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text) return
    setMessages(m => [...m, { from: 'you', text }])
    setInput('')
    try {
      const r = await api.post('/api/chatbot', { message: text })
      setMessages(m => [...m, { from: 'bot', text: r.data.reply }])
    } catch {
      setMessages(m => [...m, { from: 'bot', text: 'Sorry, error responding.' }])
    }
  }

  return (
    <div className="chatbot" style={{ display: open ? 'block' : 'none' }}>
      <div className="header">Assistant <button className="btn secondary" style={{ float: 'right' }} onClick={() => setOpen(false)}>x</button></div>
      <div className="body" ref={bodyRef}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '6px 0', textAlign: m.from === 'you' ? 'right' : 'left' }}>
            <span style={{ display: 'inline-block', background: m.from === 'you' ? '#eaf2ff' : '#f1f1f1', padding: '6px 8px', borderRadius: 6 }}>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="input">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? send() : null} placeholder="Type a message..." />
        <button onClick={send}>Send</button>
      </div>
    </div>
  )
}

