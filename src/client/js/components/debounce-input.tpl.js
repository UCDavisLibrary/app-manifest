import { html } from 'lit';

export function render() {
return html`
  <div @input=${this._onInput}>
    <slot></slot>
  </div>
`;}
