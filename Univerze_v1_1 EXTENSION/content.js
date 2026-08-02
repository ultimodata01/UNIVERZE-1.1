function injectButton() {
  if (document.getElementById('univerze-button')) return;
  const button = document.createElement('div');
  button.id = 'univerze-button';
  button.className = 'univerze-button';
  button.title = 'Univerze - Connect to Unity Bridge';
  button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="1.5" fill="none"/></svg>';
  document.body.appendChild(button);

  button.addEventListener('click', () => {
    chrome.storage.local.get('bridgePort', (data) => {
      const port = data.bridgePort || 12345;
      chrome.runtime.sendMessage({ type: 'connectBridge', port }, (response) => {
        if (response && response.success) {
          button.classList.add('connected');
          setTimeout(() => button.classList.remove('connected'), 1500);
        } else {
          button.classList.add('error');
          setTimeout(() => button.classList.remove('error'), 1500);
        }
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectButton);
} else {
  injectButton();
}