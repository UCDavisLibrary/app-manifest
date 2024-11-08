import { LitElement } from 'lit';
import { render } from "./app-page-application-landing.tpl.js";
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppPageElement from '../mixins/AppPageElement.js';
import CorkModelController from '../controllers/CorkModelController.js';

export default class AppPageApplicationLanding extends Mixin(LitElement)
  .with(LitCorkUtils, AppPageElement) {

  static get properties() {
    return {

    }
  }

  constructor() {
    super();
    this.render = render.bind(this);
  }

  async _onAppStateUpdate(state) {
    if ( this.pageId !== state.page ) return;

    this.AppStateModel.showLoading();
    this.showPageTitle();
    this.showBreadcrumbs();

    //const d = await this.getPageData();
    //if ( this.AppStateModel.showMessageIfServiceError(d) ) return;

    this.AppStateModel.showLoaded(this.pageId);

  }

}

customElements.define('app-page-application-landing', AppPageApplicationLanding);
