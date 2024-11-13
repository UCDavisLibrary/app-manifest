import { LitElement } from 'lit';
import { render } from "./app-page-application-landing.tpl.js";
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppPageElement from '../mixins/AppPageElement.js';
import CorkModelController from '../controllers/CorkModelController.js';

export default class AppPageApplicationLanding extends Mixin(LitElement)
  .with(LitCorkUtils, AppPageElement) {

  static get properties() {
    return {
      query: {type: Object}
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);

    this.application = new CorkModelController(
      this, 'ApplicationModel', [
        {property: 'list', method: 'query', defaultValue: {data: [], totalPages: 1}}
      ]);
  }

  async _onAppStateUpdate(state) {
    if ( this.pageId !== state.page ) return;

    this.AppStateModel.showLoading();
    this.showPageTitle();
    this.showBreadcrumbs();

    const d = await this.getPageData();
    if ( this.AppStateModel.showMessageIfServiceError(d) ) return;

    this.AppStateModel.showLoaded(this.pageId);

  }
  /**
   * @description Get any data required for rendering this page
   */
  async getPageData(){
    const promises = [
      this.application.list.get()
    ];
    return Promise.allSettled(promises);
  }

  setQueryFromUrl(){
    this.query = {};
  }

}

customElements.define('app-page-application-landing', AppPageApplicationLanding);
