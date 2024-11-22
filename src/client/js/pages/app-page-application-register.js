import { LitElement } from 'lit';
import { render } from "./app-page-application-register.tpl.js";
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppPageElement from '../mixins/AppPageElement.js';
import CorkModelController from '../controllers/CorkModelController.js';
import IdGenerator from '../../../lib/utils/IdGenerator.js';

export default class AppPageApplicationRegister extends Mixin(LitElement)
  .with(LitCorkUtils, AppPageElement) {

  static get properties() {
    return {
      applicationId: {type: String},
      isAnEdit: {type: Boolean}
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);

    this.idGen = new IdGenerator({pageEle: this});

    const ctlPropMapper = [
      {property: 'data', method: 'get', defaultValue: {}}
    ]
    const ctlPayloadConfig = {
      defaults: {
        appUrls: [{href: '', label: ''}]
      }
    };
    this.application = new CorkModelController(this, 'ApplicationModel', ctlPropMapper, ctlPayloadConfig);
  }

  async _onAppStateUpdate(state) {
    if ( this.pageId !== state.page ) return;

    this.application.payload.clear();

    this.isAnEdit = this.routeId === 'app-edit';
    this.applicationId = state.location.path[1];

    this.AppStateModel.showLoading();

    const d = await this.getPageData();
    if ( this.AppStateModel.showMessageIfServiceError(d) ) return;

    let breadcrumbWildCards = [];
    if ( this.isAnEdit ) {
      breadcrumbWildCards = [{text: this.application.data.value.name, pathPart: this.applicationId}];
      this.application.setPayloadData(this.application.data.value);
    }

    this.showPageTitle();
    this.showBreadcrumbs(breadcrumbWildCards);

    this.AppStateModel.showLoaded(this.pageId);

  }

  /**
   * @description Get any data required for rendering this page
   */
  async getPageData(){
    const promises = [];
    if ( this.isAnEdit ) {
      promises.push(this.application.data.get( this.applicationId ));
    }
    return Promise.allSettled(promises);
  }

}

customElements.define('app-page-application-register', AppPageApplicationRegister);
