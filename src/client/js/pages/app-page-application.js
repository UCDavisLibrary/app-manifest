import { LitElement } from 'lit';
import {render} from "./app-page-application.tpl.js";
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppPageElement from '../mixins/AppPageElement.js';
import CorkModelController from '../controllers/CorkModelController.js';

export default class AppPageApplication extends Mixin(LitElement)
  .with(LitCorkUtils, AppPageElement) {

  static get properties() {
    return {
      applicationId: {type: String}
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);

    this.application = new CorkModelController(
      this, 'ApplicationModel', [
        {property: 'data', method: 'get', defaultValue: {}}
      ]
    );
  }

  async _onAppStateUpdate(state) {
    if ( this.pageId !== state.page ) return;
    this.applicationId = state.location.path[1];

    this.AppStateModel.showLoading();
    // this.showPageTitle();
    // this.showBreadcrumbs();

    const d = await this.getPageData();
    if ( this.AppStateModel.showMessageIfServiceError(d) ) return;

    this.AppStateModel.showLoaded(this.pageId);

  }
  /**
   * @description Get any data required for rendering this page
   */
  async getPageData(){
    const promises = [
      this.application.data.get( this.applicationId )
    ];
    return Promise.allSettled(promises);
  }

}

customElements.define('app-page-application', AppPageApplication);
