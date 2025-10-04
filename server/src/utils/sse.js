const clients = new Set();

function register(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  const client = { res };
  clients.add(client);
  req.on('close', () => {
    clients.delete(client);
  });
}

function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const { res } of clients) {
    res.write(payload);
  }
}

module.exports = { register, broadcast };

