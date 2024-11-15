import { html } from 'lit';

export function render() {
return html`
  <div class='title-row'>
    <div class='title'>
      <h2 class='heading--highlight'>${this.application.name}</h2>
    </div>
  </div>
`;}
