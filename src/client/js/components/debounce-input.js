import { LitElement } from 'lit';
import { render } from "./debounce-input.tpl.js";

export default class DebounceInput extends LitElement {

  static get properties() {
    return {
      timeout: {type: Number}
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.timeout = 500;
  }

  _onInput(e){

    if( this._timeout ) {
      clearTimeout(this._timeout);
    }

    this._timeout = setTimeout(() => {
      this.dispatchEvent(new CustomEvent('debounced-input', {
        bubbles: true,
        composed: true,
        detail: {
          value: e.target.value
        }
      }));
    }, this.timeout);
  }

}

customElements.define('debounce-input', DebounceInput);
