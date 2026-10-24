(() => {
  const expectedHash = '385eb2f8a831d43e2bb452b1e05f6e56c88fdac0973d6fcd90c83dd530966774';
  const sessionKey = 'sea-cyberscam-dashboard-access-v1';

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function unlock() {
    document.documentElement.classList.remove('access-locked');
    document.querySelector('.access-gate')?.remove();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem(sessionKey) === expectedHash) {
      unlock();
      return;
    }
    const gate = document.createElement('div');
    gate.className = 'access-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'access-title');
    gate.innerHTML = `<div class="access-box">
      <span class="access-kicker">RESTRICTED RESEARCH DASHBOARD</span>
      <h1 id="access-title">请输入访问密码</h1>
      <p>该页面用于研究进度与本地数据分析。验证成功后，本次浏览器会话内的看板和地图均可访问。</p>
      <form id="access-form">
        <label for="access-password">访问密码</label>
        <input id="access-password" type="password" inputmode="numeric" autocomplete="current-password" required autofocus>
        <button type="submit">进入</button>
      </form>
      <p class="access-error" id="access-error" role="alert"></p>
    </div>`;
    document.body.append(gate);
    gate.querySelector('form').addEventListener('submit', async event => {
      event.preventDefault();
      const input = gate.querySelector('input');
      const hash = await sha256(input.value);
      if (hash === expectedHash) {
        sessionStorage.setItem(sessionKey, expectedHash);
        unlock();
      } else {
        gate.querySelector('#access-error').textContent = '密码不正确，请重新输入。';
        input.value = '';
        input.focus();
      }
    });
  });
})();
