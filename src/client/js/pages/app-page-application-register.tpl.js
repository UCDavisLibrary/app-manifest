import { html } from 'lit';

export function render() {
  const payload = this.application.payload;
  return html`
    <div class='l-container'>
      <div class='l-basic--flipped'>
        <div class="l-content">
          <form @submit=${payload.create}>
            ${ payload.validation.renderErrorMessage() }
            <div class='field-container ${payload.validation.fieldErrorClass('name')}'>
              <label for=${this.idGen.get('name')}>Application Name</label>
              <input
                id=${this.idGen.get('name')}
                type='text'
                .value=${payload.get('name')}
                @input=${e => payload.set('name', e.target.value)} />
              ${ payload.validation.renderFieldErrorMessages('name') }
            </div>
            <div class='field-container ${payload.validation.fieldErrorClass('description')}'>
              <label for=${this.idGen.get('description')}>Description</label>
              <textarea
                id=${this.idGen.get('description')}
                .value=${payload.get('description')}
                rows='5'
                @input=${e => payload.set('description', e.target.value)}>
              </textarea>
              ${ payload.validation.renderFieldErrorMessages('description') }
            </div>
            <fieldset>
              <legend>Maintenance Schedule</legend>
              <div class='l-2col grid--simple-override'>
                <div class="l-first">
                  <div class='field-container ${payload.validation.fieldErrorClass('maintenanceInterval')}'>
                    <label for=${this.idGen.get('maintenanceInterval')}>Interval (in Months)</label>
                    <input
                      id=${this.idGen.get('maintenanceInterval')}
                      type='number'
                      .value=${payload.get('maintenanceInterval')}
                      @input=${e => payload.set('maintenanceInterval', e.target.value)} />
                    ${ payload.validation.renderFieldErrorMessages('maintenanceInterval') }
                  </div>
                </div>
                <div class='l-second'>
                  ${renderInput.call(this, 'nextMaintenance', 'Next Maintenance', 'date')}
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend>SSL Cert Expiration</legend>
              ${renderInput.call(this, 'sslCertExpiration', 'Expiration Date', 'date')}
              <div class='field-container ${payload.validation.fieldErrorClass('certCheckDisabled')}'>
                <div class='checkbox'>
                  <input
                    id=${this.idGen.get('certCheckDisabled')}
                    type='checkbox'
                    .checked=${payload.get('certCheckDisabled')}
                    @input=${e => payload.toggle('certCheckDisabled')} />
                  <label for=${this.idGen.get('certCheckDisabled')}>Disable SSL Cert Check</label>
                </div>
              </div>
            </fieldset>
            <button class='btn btn--primary' type='submit'>Submit</button>
          </form>
        </div>
        <div class="l-sidebar-first"></div>
      </div>
    </div>
  `;}

  function renderInput(prop, label, inputType='text'){
    const payload = this.application.payload;
    return html`
      <div class='field-container ${payload.validation.fieldErrorClass(prop)}'>
        <label for=${this.idGen.get(prop)}>${label}</label>
        <input
          id=${this.idGen.get(prop)}
          type=${inputType}
          .value=${payload.get(prop)}
          @input=${e => payload.set(prop, e.target.value)} />
        ${ payload.validation.renderFieldErrorMessages(prop) }
      </div>
    `;
  }
