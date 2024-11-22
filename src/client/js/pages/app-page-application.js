import { LitElement } from 'lit';
import {render} from "./app-page-application.tpl.js";
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import AppPageElement from '../mixins/AppPageElement.js';
import CorkModelController from '../controllers/CorkModelController.js';
import appRoutes from '../../../lib/utils/appRoutes.js';

export default class AppPageApplication extends Mixin(LitElement)
  .with(LitCorkUtils, AppPageElement) {

  static get properties() {
    return {
      applicationId: {type: String},
      actions: {type: Array}
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

    this.actions = [
      {text: 'Edit', cb: () => this.goToEdit()},
      {text: 'Delete', cb: () => this.showDeleteDialog()}
    ];
  }

  goToEdit(){
    const pageUrl = appRoutes.getPageLink('app-edit').replace('*', this.applicationId);
    this.AppStateModel.setLocation(pageUrl);
  }

  showDeleteDialog(){
    this.AppStateModel.showDialogModal({
      title: 'Delete Application',
      content: 'Are you sure you want to delete this application?. This action cannot be undone.',
      actions: [
        {text: 'Delete', value: 'delete-application', color: 'double-decker'},
        {text: 'Cancel', value: 'cancel', invert: true, color: 'primary'}
      ],
      data: {applicationId: this.applicationId}
    });
  }

  async _onAppDialogAction(e) {
    if ( e.action !== 'delete-application' || e.data.applicationId !== this.applicationId ) return;
    this.AppStateModel.showLoading();
    const r = await this.application.model.delete(this.applicationId);
    if ( this.AppStateModel.showMessageIfServiceError(r) ) return;
    this.AppStateModel.showToast({message: 'Application deleted successfully', type: 'success'});
    this.AppStateModel.setLocation(appRoutes.getPageLink('app-landing'));

  }

  _onActionClick(e){
    const i = e.detail.location[0];
    if ( this.actions[i].cb ) this.actions[i].cb();
  }

  async _onAppStateUpdate(state) {
    if ( this.pageId !== state.page ) return;
    this.applicationId = state.location.path[1];

    this.AppStateModel.showLoading();

    const d = await this.getPageData();
    if ( this.AppStateModel.showMessageIfServiceError(d) ) return;

    this.showPageTitle(this.application.data.value.name);
    this.showBreadcrumbs([{text: this.application.data.value.name, pathPart: this.applicationId}]);

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
