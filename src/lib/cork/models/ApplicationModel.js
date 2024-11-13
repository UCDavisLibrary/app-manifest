import {BaseModel} from '@ucd-lib/cork-app-utils';
import ApplicationService from '../services/ApplicationService.js';
import ApplicationStore from '../stores/ApplicationStore.js';

class ApplicationModel extends BaseModel {

  constructor() {
    super();

    this.store = ApplicationStore;
    this.service = ApplicationService;

    this.register('ApplicationModel');
  }

  create(data){
    return this.service.create(data);
  }

  async query(queryObject={}){
    return await this.service.query(queryObject);
  }

}

const model = new ApplicationModel();
export default model;
