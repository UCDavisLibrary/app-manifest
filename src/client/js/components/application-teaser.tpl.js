import { html } from 'lit';

export function render() {
return html`
  <div class='title-row'>
    <div class='title'>
      <h2 class='heading--highlight'>${this.application.name}</h2>
    </div>
  </div>
  <div class='teaser-body'>
    <div class='body-section'>
      <div class='teaser-icon'>
        <i class='fa-solid fa-calendar'></i>
      </div>
      <div class='date-grid'>
        <div>Next Maintenance</div>
        <div>yyyy-mm-dd</div>
        <div>SSL Cert Expiration</div>
        <div>yyyy-mm-dd</div>
      </div>
    </div>
    <div class='separator'></div>
    <div class='body-section'>
      <div class='teaser-icon'>
        <i class='fa-solid fa-circle-exclamation'></i>
      </div>

    </div>

  </div>
`;}
