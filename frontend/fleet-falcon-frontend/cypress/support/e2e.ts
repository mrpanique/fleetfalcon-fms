// Cypress E2E support file
// Documentation: https://docs.cypress.io/guides/tooling/plugins-guide

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from logs for cleaner output
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');

  app.document.head.appendChild(style);
}
