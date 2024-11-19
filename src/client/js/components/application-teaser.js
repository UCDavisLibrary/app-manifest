import { LitElement } from 'lit';
import { render } from "./application-teaser.tpl.js";
import { LitCorkUtils, Mixin } from '@ucd-lib/cork-app-utils';
import { MainDomElement } from "@ucd-lib/theme-elements/utils/mixins/main-dom-element.js";
import appRoutes from '../../../lib/utils/appRoutes.js';

export default class ApplicationTeaser extends Mixin(LitElement)
  .with(LitCorkUtils, MainDomElement) {

  static get properties() {
    return {
      application: {type: Object},
      maintenanceDate: {type: String},
      sslCertExpiration: {type: String},
      badges: {type: Array},
      pageUrl: {type: String}
    }
  }

  constructor() {
    super();
    this.render = render.bind(this);

    this.application = {};
  }

  willUpdate(props) {
    if( props.has('application') ) {
      this._setMaintenanceDate();
      this._setSslCertExpirationDate();
      this._setBadges();
      this._setPageUrl();
    }
  }

  _setPageUrl(){
    this.pageUrl = appRoutes.getPageLink('app-single').replace('*', this.application.applicationId);
  }

  _setBadges(){
    const badges = [];

    if ( this.application?.nextMaintenance ){
      const diffDays = this._getDiffDays(this.application.nextMaintenance);
      if ( diffDays < 0 ){
        badges.push({text: 'Overdue Maintenance', type: 'error'});
      } else if ( diffDays < 30  ){
        badges.push({text: 'Upcoming Maintenance'});
      }
    }

    if ( this.application?.sslCertExpiration ){
      const diffDays = this._getDiffDays(this.application.sslCertExpiration);
      if ( diffDays < 0 ){
        badges.push({text: 'Expired SSL Certificate', type: 'error'});
      } else if ( diffDays < 30 ){
        badges.push({text: 'Expiring SSL Certificate'});
      }
    }

    this.badges = badges;
  }

  _getDiffDays(date){
    const maintenanceDate = new Date(date.split('T')[0]);
    const today = new Date();
    const diffTime = maintenanceDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  _setMaintenanceDate(){
    let maintenanceDate = 'Never';
    if ( this.application?.nextMaintenance ){
      maintenanceDate = this.application.nextMaintenance.split('T')[0];
    }
    this.maintenanceDate = maintenanceDate;
  }

  _setSslCertExpirationDate(){
    let certExpiration = 'Unknown';
    if ( this.application?.sslCertExpiration ){
      certExpiration = this.application.sslCertExpiration.split('T')[0];
    }
    this.sslCertExpiration = certExpiration;
  }

}

customElements.define('application-teaser', ApplicationTeaser);
