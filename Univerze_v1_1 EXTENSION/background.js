chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'connectBridge') {
    const port = request.port || 12345;
    fetch(`http://localhost:${port}/connect`, { method: 'GET' })
      .then(response => response.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  if (request.type === 'sendToBridge') {
    const port = request.port || 12345;
    fetch(`http://localhost:${port}/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.payload)
    })
      .then(response => response.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('bridgePort', (data) => {
    if (!data.bridgePort) {
      chrome.storage.local.set({ bridgePort: 12345 });
    }
  });
});