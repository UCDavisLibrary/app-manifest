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
              <label>Application Name</label>
              <input
                type='text'
                .value=${payload.get('name')}
                @input=${e => payload.set('name', e.target.value)} />
              ${ payload.validation.renderFieldErrorMessages('name') }
            </div>
            <button class='btn btn--primary' type='submit'>Submit</button>
          </form>
        </div>
        <div class="l-sidebar-first"></div>
      </div>
    </div>
  `;}
