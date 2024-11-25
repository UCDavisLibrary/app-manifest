import { LitElement } from 'lit';
import {render} from "./link-icon-button.tpl.js";
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import { MainDomElement } from "@ucd-lib/theme-elements/utils/mixins/main-dom-element.js";

export default class LinkIconButton extends Mixin(LitElement)
  .with(LitCorkUtils, MainDomElement) {

  static get properties() {
    return {
      icon: {type: String},
      links: {type: Array},
      _icon: {state: true},
      _href: {state: true}
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);
    this.icon = '';
    this.links = [];
  }

  willUpdate(props) {
    if( props.has('icon') ) {
      this._icon = `fa-solid fa-${this.icon}`;
    }
    if ( props.has('links') ) {
      this.parseLinks();
    }
  }

  parseLinks(){
    if ( !this.links?.length ){
      this._href = null;
      return;
    } else if ( this.links.length === 1 ){
      this._href = this.links[0].href;
      return;
    } else {
      this._href = null;
    }
  }

}

customElements.define('link-icon-button', LinkIconButton);
