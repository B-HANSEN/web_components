const template = document.createElement('template'); // create template
template.innerHTML = `
  <style>
  .user-card {
		font-family: 'Arial', sans-serif;
		background: #f4f4f4;
		width: 500px;
		display: grid;
		grid-template-columns: 1fr 2fr;
		grid-gap: 10px;
		margin-bottom: 15px;
		border-bottom: darkorchid 5px solid;
	}

	.user-card img {
		width: 100%;
	}

	.user-card button {
		cursor: pointer;
		background: darkorchid;
		color: #fff;
		border: 0;
		border-radius: 5px;
		padding: 5px 10px;
	}
  </style>
  <div class="user-card">
    <img />
    <div>
      <h3></h3>
      <div class="info">
        <p><slot name="email" /></p>
        <p><slot name="phone" /></p>
      </div>
      <button id="toggle-info">Hide Info</button>
    </div>
  </div>
`;

class UserCard extends HTMLElement {
  constructor() { // called when instance of the element is created, e.g. initialise state and create event listeners
    super(); // call constructor method of HTML Element

    this.showInfo = true;

    this.attachShadow({ mode: 'open' }); // create sub DOM tree next to light DOM to provide encapsulation
    this.shadowRoot.appendChild(template.content.cloneNode(true)); // clone template to shadowRoot
    this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
    this.shadowRoot.querySelector('img').src = this.getAttribute('avatar');
  }

  // reflecting properties from attributes in getters & setters
  // getters
  get checked() {
    return this.hasAttribute('checked')
  }

  // setters
  set checked(val) {				
    if(val) this.setAttribute('checked', '');
    else this.removeAttribute('checked');
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;

    const info = this.shadowRoot.querySelector('.info');
    const toggleBtn = this.shadowRoot.querySelector('#toggle-info');

    if(this.showInfo) {
      info.style.display = 'block';
      toggleBtn.innerText = 'Hide Info';
    } else {
      info.style.display = 'none';
      toggleBtn.innerText = 'Show Info';
    }
  }

  connectedCallback() { // called when element is inserted into DOM
    this.shadowRoot.querySelector('#toggle-info').addEventListener('click', () => this.toggleInfo());
  }

  disconnectedCallback() { // called when element is removed from DOM
    this.shadowRoot.querySelector('#toggle-info').removeEventListener();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    //  called when an attribute is added, removed, updated or replaced
  }
}

window.customElements.define('user-card', UserCard);
