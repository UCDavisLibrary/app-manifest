import BaseService from './BaseService.js';
import { digest } from '@ucd-lib/cork-app-utils';
import ApplicationStore from '../stores/ApplicationStore.js';
import { appConfig } from '../../appGlobals.js';
import objectUtils from '../../utils/objectUtils.js';
import qs from 'qs';

class ApplicationService extends BaseService {

  constructor() {
    super();
    this.store = ApplicationStore;
    this.basePath = `${appConfig.apiRoot}/application`;
    this.createId = 1;
    this.storeCaches = [
      this.store.data.query,
      this.store.data.get
    ];
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

  async update(data){
    let id = data.applicationId;
    const store = this.store.data.update;

    await this.request({
      url: `${this.basePath}/${id}`,
      fetchOptions: {
        method: 'PUT',
        body: data
      },
      json: true,
      onUpdate : resp => this.store.set(
        {...resp, id},
        store
      )
    });

    const r = store.get(id);
    this.clearCache(r);
    return r;
  }

  async delete(id){
    const store = this.store.data.delete;

    await this.request({
      url: `${this.basePath}/${id}`,
      fetchOptions: {
        method: 'DELETE'
      },
      json: true,
      onUpdate : resp => this.store.set(
        {...resp, id},
        store
      )
    });

    const r = store.get(id);
    this.clearCache(r);
    return r;
  }

  async get(id){
    const store = this.store.data.get;

    await this.checkRequesting(
      id, store,
      () => this.request({
        url : `${this.basePath}/${id}`,
        checkCached: () => store.get(id),
        onUpdate: resp => this.store.set(
          {...resp, id},
          store
        )
      })
    );

    return store.get(id);

  }

  async query(queryObj={}){
    if ( !queryObj.page ) queryObj.page = '1';
    let id = await digest(queryObj);
    const store = this.store.data.query;

    let request = this.checkRequesting(
      id, store,
      () => this.request({
        url : `${this.basePath}?${qs.stringify(objectUtils.kebabCaseKeys(queryObj))}`,
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
