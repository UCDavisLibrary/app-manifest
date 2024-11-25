import { html } from 'lit';
import './link-icon-button.js';

export function render() {
return html`
  <div class='badges'>
    ${this.badges.map(badge => html`
      <div class='badge ${badge.type ? `badge--${badge.type}` : ''}'>${badge.text}</div>
    `)}
  </div>
  <div class='title-row'>
    <div class='title'>
      <a href=${this.pageUrl}><h2 class='heading--highlight'>${this.application.name}</h2></a>
    </div>
    <div class='icon-buttons'>
      <link-icon-button icon='link' .links=${this.application.appUrls}></link-icon-button>
      <link-icon-button icon='book' .links=${this.application.documentationUrls}></link-icon-button>
    </div>
  </div>
  <div class='teaser-body'>
    <div class='body-section'>
      <div class='teaser-icon'>
        <i class='fa-solid fa-calendar'></i>
      </div>
      <div class='date-grid'>
        <div>Next Maintenance:</div>
        <div>${this.maintenanceDate}</div>
        <div>SSL Cert Expiration:</div>
        <div>${this.sslCertExpiration}</div>
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
