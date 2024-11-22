import { html } from 'lit';

import '@ucd-lib/theme-elements/brand/ucd-theme-subnav/ucd-theme-subnav.js'

export function render() {
  return html`
    <div class='l-container'>
      <div class='l-basic--flipped'>
        <div class="l-content">An application page</div>
        <div class="l-sidebar-first">
          <div>
            <ucd-theme-subnav nav-title='Actions' @item-click=${this._onActionClick}>
              ${this.actions.map(action => html`
                <a>${action.text}</a>`
              )}
            </ucd-theme-subnav>
          </div>
        </div>
      </div>
    </div>
`;}
