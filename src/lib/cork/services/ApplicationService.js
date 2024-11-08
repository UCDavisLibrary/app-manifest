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
  }

  async create(data){
    let id = this.createId++;
    let request = this.request({
      url: this.basePath,
      fetchOptions: {
        method: 'POST',
        body: data
      },
      json: true,
      onUpdate : resp => this.store.set(
        {...resp, id},
        this.store.data.create
      )
    });

    return {id, request};
  }

}

const service = new ApplicationService();
export default service;
