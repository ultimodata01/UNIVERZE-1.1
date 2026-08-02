const portInput = document.getElementById('port');
const saveBtn = document.getElementById('save');
const testBtn = document.getElementById('test');
const statusEl = document.getElementById('status');

function setStatus(state, text) {
  statusEl.className = `status-indicator ${state}`;
  statusEl.querySelector('.status-text').textContent = text;
}

function checkConnection(port) {
  setStatus('', 'Checking...');
  chrome.runtime.sendMessage({ type: 'connectBridge', port }, (response) => {
    if (chrome.runtime.lastError) {
      setStatus('disconnected', 'Error');
      return;
    }
    if (response && response.success) {
      setStatus('connected', 'Connected');
    } else {
      setStatus('disconnected', 'Offline');
    }
  });
}

chrome.storage.local.get('bridgePort', (data) => {
  const port = data.bridgePort || 12345;
  portInput.value = port;
  checkConnection(port);
});

saveBtn.addEventListener('click', () => {
  const port = parseInt(portInput.value, 10) || 12345;
  chrome.storage.local.set({ bridgePort: port }, () => {
    saveBtn.textContent = 'Saved!';
    setTimeout(() => { saveBtn.innerHTML = '<span>Save Settings</span>'; }, 1200);
    checkConnection(port);
  });
});

testBtn.addEventListener('click', () => {
  const port = parseInt(portInput.value, 10) || 12345;
  checkConnection(port);
});