import { html } from 'lit';

import '@ucd-lib/theme-elements/brand/ucd-theme-pagination/ucd-theme-pagination.js';
import '@ucd-lib/theme-elements/brand/ucd-theme-slim-select/ucd-theme-slim-select.js'

import '../components/application-teaser.js';
import '../components/debounce-input.js';
import '../components/no-results.js';
import selectOptions from '../../../lib/utils/selectOptions.js';

export function render() {
  return html`
    <div class='l-container'>
      <div class='l-basic--flipped'>
        <div class="l-content">
          ${renderFilters.call(this)}
          <div ?hidden=${!this.application.list.value.data.length}>
            ${this.application.list.value.data.map(app => html`
              <application-teaser .application=${app}></application-teaser>
            `)}
            <ucd-theme-pagination
                current-page=${this.application.list.value.page}
                max-pages=${this.application.list.value.totalPages}
                @page-change=${e => this.query.set('page', e.detail.page)}>
                xs-screen>
            </ucd-theme-pagination>
          </div>
          <no-results
            .mainText=${'No applications found'}
            .results=${this.application.list.value.data}>
          </no-results>
        </div>
        <div class="l-sidebar-first"></div>
      </div>
    </div>
  `;
}

function renderFilters(){
  return html`
    <div class='page-filter-wrapper'>
      <div class='l-3col grid--simple-override'>
        <div class="l-first">
          <div class='field-container'>
            <label for=${this.igen.get('keyword')}>Keyword</label>
            <debounce-input @debounced-input=${e => this.query.set('keyword', e.detail.value)}>
              <input
                id=${this.igen.get('keyword')}
                type='text'
                .value=${this.query.get('keyword', '')}
                placeholder='Search...'
              >
            </debounce-input>
          </div>
        </div>
        <div class='l-second'>
          ${renderSelect.call(this, 'nextMaintenance', 'Next Maintenance', selectOptions.maintenanceIntervals)}
        </div>
        <div class='l-third'>
          ${renderSelect.call(this, 'sslExpiration', 'SSL Expiration', selectOptions.sslExpirationIntervals)}
        </div>
      </div>
    </div>
  `;
}

function renderSelect(prop, label, options){
  return html`
    <div class='field-container'>
      <label for=${this.igen.get(prop)}>${label}</label>
      <select id=${this.igen.get(prop)} @input=${e => this.query.set(prop, e.target.value)}>
        ${options.map(option => html`
          <option value=${option.value} ?selected=${this.query.equals(prop, option.value)}>
            ${option.label}
          </option>
        `)}
      </select>
    </div>
  `;
}
