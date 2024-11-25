import { html } from 'lit';

export function render() {
  const payload = this.application.payload;
  return html`
    <div class='l-container'>
      <div class='l-basic--flipped'>
        <div class="l-content">
          <form @submit=${this.isAnEdit? payload.update : payload.create}>
            ${ payload.validation.renderErrorMessage() }
            ${ payload.renderInput({prop: 'name', label: 'Application Name *'}) }
            ${ payload.renderTextarea({prop: 'description', label: 'Description'}) }
            ${ payload.renderCheckbox({prop: 'isArchived', label: 'Archive Application'}) }
            <fieldset>
              <legend>Application URLs</legend>
              ${payload.get('appUrls').map((url, i) => html`
                <div class='l-2col grid--simple-override'>
                  <div class="l-first">
                    ${payload.renderInput({prop: 'href', label: 'Link *', obj: url, errorField: `appUrls[${i}].href`})}
                  </div>
                  <div class='l-second'>
                    ${payload.renderInput({prop: 'label', label: 'Label', obj: url, errorField: `appUrls[${i}].label`})}
                  </div>
                </div>
                <div class='flex flex--justify-end'>
                  ${payload.renderRepeaterDeleteButton({prop: 'appUrls', index: i, label: 'Remove URL'})}
              </div>
              `)}
              <div class='flex flex--justify-end u-space-mt--medium'>
                ${payload.renderRepeaterAddButton({prop: 'appUrls', label: 'Add URL', value: this.getLinkObj()})}
              </div>
            </fieldset>
            <fieldset>
              <legend>Documentation URLs</legend>
              ${payload.get('documentationUrls').map((url, i) => html`
                <div class='l-2col grid--simple-override'>
                  <div class="l-first">
                    ${payload.renderInput({prop: 'href', label: 'Link *', obj: url, errorField: `documentationUrls[${i}].href`})}
                  </div>
                  <div class='l-second'>
                    ${payload.renderInput({prop: 'label', label: 'Label', obj: url, errorField: `documentationUrls[${i}].label`})}
                  </div>
                </div>
                <div class='flex flex--justify-end'>
                  ${payload.renderRepeaterDeleteButton({prop: 'documentationUrls', index: i, label: 'Remove URL'})}
              </div>
              `)}
              <div class='flex flex--justify-end u-space-mt--medium'>
                ${payload.renderRepeaterAddButton({prop: 'documentationUrls', label: 'Add URL', value: this.getLinkObj()})}
              </div>
            </fieldset>
            <fieldset>
              <legend>Maintenance Schedule</legend>
              <div class='l-2col grid--simple-override'>
                <div class="l-first">
                  ${payload.renderInput({prop: 'maintenanceInterval', label: 'Interval (in Months)', type: 'number'})}
                </div>
                <div class='l-second'>
                  ${payload.renderInput({prop: 'nextMaintenance', label: 'Next Maintenance', type: 'date'})}
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend>SSL Cert Expiration</legend>
              ${payload.renderInput({prop: 'sslCertExpiration', label: 'Expiration Date', type: 'date'})}
              ${payload.renderCheckbox({prop: 'certCheckDisabled', label: 'Disable SSL Cert Check'})}
            </fieldset>
            <button class='btn btn--primary' type='submit'>Submit</button>
          </form>
        </div>
        <div class="l-sidebar-first"></div>
      </div>
    </div>
  `;}
