import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export function render() {

  if ( !this.links.length ) return html``;

  return html`
    <a class='main' href=${ifDefined(this._href)}>
      <i class='fa-solid fa-${this.icon}'></i>
    </a>
  `;
}
