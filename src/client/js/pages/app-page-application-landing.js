import { LitElement } from 'lit';
import { render } from "./app-page-application-landing.tpl.js";
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppPageElement from '../mixins/AppPageElement.js';
import CorkModelController from '../controllers/CorkModelController.js';
import QueryController from '../controllers/QueryController.js';
import IdGenerator from '../../../lib/utils/IdGenerator.js';

export default class AppPageApplicationLanding extends Mixin(LitElement)
  .with(LitCorkUtils, AppPageElement) {

  static get properties() {
    return {
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);

    this.igen = new IdGenerator({pageEle: this});

    this.query = new QueryController(this);

    this.application = new CorkModelController(
      this, 'ApplicationModel', [
        {property: 'list', method: 'query', defaultValue: {data: [], totalPages: 1, page: 1}}
      ]
    );
  }

  async _onAppStateUpdate(state) {
    if ( this.pageId !== state.page ) return;
    this.query.setFromQueryString();

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
      this.application.list.get( this.query.payload )
    ];
    return Promise.allSettled(promises);
  }

}

customElements.define('app-page-application-landing', AppPageApplicationLanding);
