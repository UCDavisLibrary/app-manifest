import BaseService from './BaseService.js';
import { digest } from '@ucd-lib/cork-app-utils';
import ApplicationStore from '../stores/ApplicationStore.js';
import { appConfig } from '../../appGlobals.js';

class ApplicationService extends BaseService {

  constructor() {
    super();
    this.store = ApplicationStore;
    this.basePath = `${appConfig.apiRoot}/application`;
    this.createId = 1;
    this.storeCaches = [this.store.data.query];
  }

  create(data){
    let id = this.createId++;
    const store = this.store.data.create;
    let request = this.request({
      url: this.basePath,
      fetchOptions: {
        method: 'POST',
        body: data
      },
      json: true,
      onUpdate : resp => this.store.set(
        {...resp, id},
        store
      )
    });
    const r = {id, request, store};
    this.clearCache(r);
    return r;
  }

  async query(queryObj={}){
    if ( !queryObj.page ) queryObj.page = 1;
    let id = await digest(queryObj);
    const store = this.store.data.query;

    let request = this.checkRequesting(
      id, store,
      () => this.request({
        url : this.basePath,
        checkCached: () => store.get(id),
        onUpdate: resp => this.store.set(
          {...resp, id},
          store
        )
      })
    );

    return {id, request, store};

  }

}

const service = new ApplicationService();
export default service;
