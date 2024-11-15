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
                    <label for=${this.idGen.get('maintenanceInterval')}>Interval</label>
                    <input
                      id=${this.idGen.get('maintenanceInterval')}
                      type='number'
                      .value=${payload.get('maintenanceInterval')}
                      @input=${e => payload.set('maintenanceInterval', e.target.value)} />
                    ${ payload.validation.renderFieldErrorMessages('maintenanceInterval') }
                  </div>
                </div>
                <div class='l-second'>
                  <div class='field-container ${payload.validation.fieldErrorClass('nextMaintenance')}'>
                    <label for=${this.idGen.get('nextMaintenance')}>Next Maintenance</label>
                    <input
                      id=${this.idGen.get('nextMaintenance')}
                      type='date'
                      .value=${payload.get('nextMaintenance')}
                      @input=${e => payload.set('nextMaintenance', e.target.value)} />
                    ${ payload.validation.renderFieldErrorMessages('nextMaintenance') }
                  </div>
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
