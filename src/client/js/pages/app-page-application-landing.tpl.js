import { html } from 'lit';

export function render() {
return html`
  <div class='l-container'>
    <div class='l-basic--flipped'>
      <div class="l-content">
        ${this.application.list.value.data.map(app => html`
            <p>${app.name}</p>
          `)}
      </div>
      <div class="l-sidebar-first"></div>
    </div>
  </div>

`;}
