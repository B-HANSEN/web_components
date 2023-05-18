class ConfirmLink extends HTMLAnchorElement { // if extending element other than HTMLElement, require to maintain standard tag in index.html
    connectedCallback() {
      this.addEventListener('click', event => {
        if (!confirm('Do you really want to leave?')) {
          event.preventDefault();
        }
      });
    }
  }
  
  customElements.define('uc-confirm-link', ConfirmLink, { extends: 'a' }); // third arg object { extends; 'a' } needs to be added here, index.html: render a-tag not customised tag
  