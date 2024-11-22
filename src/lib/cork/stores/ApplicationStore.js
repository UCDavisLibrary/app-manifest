import {BaseStore, LruStore} from '@ucd-lib/cork-app-utils';

class ApplicationStore extends BaseStore {

  constructor() {
    super();

    this.data = {
      create: new LruStore({name: 'application.create'}),
      update: new LruStore({name: 'application.update'}),
      query: new LruStore({name: 'application.query'}),
      get: new LruStore({name: 'application.get'}),
      delete: new LruStore({name: 'application.delete'})
    };

    this.events = {};
  }

}

const store = new ApplicationStore();
export default store;
