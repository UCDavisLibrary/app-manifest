import {BaseStore, LruStore} from '@ucd-lib/cork-app-utils';

class ApplicationStore extends BaseStore {

  constructor() {
    super();

    this.data = {
      create: new LruStore({name: 'application.create'}),
      query: new LruStore({name: 'application.query'})
    };

    this.events = {};
  }

}

const store = new ApplicationStore();
export default store;
