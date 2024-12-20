import appRoutes from "../../../lib/utils/appRoutes.js";

/**
 * @description Mixin for app page elements
 * should be used for any direct child of the main <ucdlib-pages> element
 */
export default (superClass) => class extends superClass {

  constructor() {
    super();
    this._injectModel('AppStateModel');
  }

  // disable the shadow dom
  // all styles should be placed in app scss files
  createRenderRoot() {
    return this;
  }

  /**
   * @description return the page id, which is used by parent ucdlib-pages element to show/hide pages
   */
  get pageId() {
    return this.getAttribute('page-id');
  }

  /**
   * @description Show the page title
   * @param {String|Function} title - Page title
   *  - undefined: Page Title defined in appRoutes class
   *  - String: Static page title
   *  - Function: Dynamic page title
   * @returns
   */
  showPageTitle(title){
    if ( typeof title === 'string' ){
      this.AppStateModel.setTitle(title);
      return;
    }
    if ( !this.routeId ){
      this.logger.error('showPageTitle: routeId not set');
      return;
    }
    if ( typeof title === 'function' ){
      appRoutes.setDynamicPageTitle(this.routeId, title);
    }
    const pageTitle = appRoutes.pageTitle(this.routeId);
    this.logger.debug('Setting Page Title', pageTitle);
    this.AppStateModel.setTitle(pageTitle);
  }

  /**
   * @description Hide the page title
   */
  hidePageTitle(){
    this.AppStateModel.setTitle({show: false});
  }

  showBreadcrumbs(dynamicValues=[]){
    if ( !this.routeId ){
      this.logger.error('showPageTitle: routeId not set');
      return;
    }
    const page = appRoutes.getByRouteId(this.routeId);
    if ( !page ) return;

    let excludeHome = false;
    if ( page.isHome ){
      excludeHome = true;
    }
    const breadcrumbs = appRoutes.breadcrumbs(this.routeId, excludeHome);

    if ( dynamicValues.length ){
      let hasWildcardCount = 0;
      for( const crumb of breadcrumbs ){
        const wildcardCount = (crumb.link.match(/\*/g) || []).length;
        if ( !wildcardCount ) continue;
        hasWildcardCount++;
        for ( let i = 0; i < wildcardCount; i++ ){
          if ( !dynamicValues[i] ){
            this.logger.warning('showBreadcrumbs: dynamicValues not set for all wildcards');
            continue;
          }
          crumb.link = crumb.link.replace('*', dynamicValues[i].pathPart);
        }
        if ( dynamicValues[hasWildcardCount - 1]?.text ){
          crumb.text = dynamicValues[hasWildcardCount - 1].text;
        }
      }
    }
    this.logger.debug('Breadcrumbs', breadcrumbs);
    this.AppStateModel.setBreadcrumbs(breadcrumbs);
  };

  hideBreadcrumbs(){
    this.AppStateModel.setBreadcrumbs(false);
  }

  /**
   * @description Show the current page. Ususally used to come back from a loading state.
   */
  show(){
    this.AppStateModel.showLoaded(this.pageId);
  }

  /**
   * @description Attached to AppStateModel app-route-id-update event
   * @param {*} e
   * @returns
   */
  _onAppRouteIdUpdate(e){
    if ( e.pageId !== this.pageId ) return;
    this.routeId = e.routeId;
  }

}
