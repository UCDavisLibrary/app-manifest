import { html, css} from 'lit';

export function styles(){
  const elementStyles = css`
    ::slotted(*){
      box-sizing: border-box !important;
    }
  `;
  return [elementStyles];
}

export function render() {
return html`
  <div @input=${this._onInput}>
    <slot></slot>
  </div>
`;}
