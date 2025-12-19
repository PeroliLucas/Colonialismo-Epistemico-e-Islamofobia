const BASE_PATH = location.hostname.includes('github.io')
  ? '/colonialismo-epistemico-e-islamofobia'
  : '';

function loadHTML(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;

  fetch(`${BASE_PATH}${path}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Erro ao carregar ${path}`);
      }
      return res.text();
    })
    .then(html => {
      el.innerHTML = html;

      // Corrige todos os links internos após carregar
      el.querySelectorAll('[data-link]').forEach(link => {
        link.href = BASE_PATH + link.dataset.link;
      });
    })
    .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', () => {
  loadHTML('header', '/components/header.html');
  loadHTML('footer', '/components/footer.html');
});
