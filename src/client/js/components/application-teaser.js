import { LitElement } from 'lit';
import { render } from "./application-teaser.tpl.js";
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import { MainDomElement } from "@ucd-lib/theme-elements/utils/mixins/main-dom-element.js";

export default class ApplicationTeaser extends Mixin(LitElement)
  .with(LitCorkUtils, MainDomElement) {

  static get properties() {
    return {
      application: {type: Object}
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);

    this.application = {};
  }

}

customElements.define('application-teaser', ApplicationTeaser);
