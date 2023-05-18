class Tooltip extends HTMLElement {
    constructor() {
      super(); // call constructor of super class
      this._tooltipIcon;
      this._tooltipVisible = false;
      this._tooltipText = 'Some dummy tooltip text.'; // declare field and initialise
      this.attachShadow({ mode: 'open' }); // create shadow DOM to use encapsulation, best practice in open mode
      
      // initialise the template
      // slotted content actually part of light DOM >> styling not encapsulated
      // solution: use pseudo-class: "::slotted() {}" or "::slotted(.class or span etc) {}"
      // note: light DOM styling with higher specificty than shadow DOM styling
      this.shadowRoot.innerHTML = `
            <style>
                div {
                  font-weight: normal;
                  background-color: black;
                  color: white;
                  position: absolute;
                  top: 1.5rem;
                  left: 0.75rem;
                  z-index: 10;
                  padding: 0.15rem;
                  border-radius: 3px;
                  box-shadow: 1px 1px 6px rgba(0,0,0,0.26);
                }
                :host{
                  position: relative;
                }
                :host(.important) {
                  background: var(--color-primary, #ccc);
                  padding: 0.15rem;
                }
                :host-context(p) {
                  font-weight: bold;
                }
                // ::slotted(.highlight) { // not used
                //   border-bottom: 1px dotted red;
                // }
                .icon {
                  background: black;
                  color: white;
                  padding 0.15rem 0.5rem;
                  text-align: center;
                  border-radius: 25%;
                }
            </style>
            <slot>Some default</slot>
            <span class='icon'>?</span>
          `;
        }
  
    // runs when custom element is added to light DOM
    connectedCallback() { // add listeners and append children
      if (this.hasAttribute('text')) {
        this._tooltipText = this.getAttribute('text');
      }
      this._tooltipIcon = this.shadowRoot.querySelector('span'); // add to span tag only
      this._tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
      this._tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
      
      // this.shadowRoot.appendChild(tooltipIcon); // already defined in template
      this._render();
    }

    // Note: attribute changes not picked up because there is no logic for that in the component.
    // The 'text' attribute is extracted in 'connectedCallback' (i.e. when the component gets mounted to the DOM) only.
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      if (name === 'text') this._tooltipText = newValue;
    }

    static get observedAttributes() { // inform JS to observe attribute changes
      return ['text']; // specify which attributes to be observed
    }

    disconnectedCallback() { // any cleanup work after element is destroyed
      this._tooltipIcon.removeEventListener('mouseenter', this._showTooltip);
      this._tooltipIcon.removeEventListener('mouseleave', this._hideTooltip);
    }

    _render() { // consolidate all render logic here; related to changing shadow DOM; other code to change data
      let tooltipContainer = this.shadowRoot.querySelector('div');
      if(this._tooltipVisible) {
        tooltipContainer = document.createElement('div');
        tooltipContainer.textContent = this._tooltipText; // use default or attribute text into tooltip
        this.shadowRoot.appendChild(tooltipContainer);
      } else {
        if(tooltipContainer) {
          this.shadowRoot.removeChild(tooltipContainer);
        } 
      }
    }

    _showTooltip() {
      this._tooltipVisible = true;
      this._render();
    }
  
    _hideTooltip() {
      this._tooltipVisible = false;
      this._render();
    }
  }
  
  // register element in DOM
  customElements.define('uc-tooltip', Tooltip);
  

