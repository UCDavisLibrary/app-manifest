import {PayloadUtils} from '@ucd-lib/cork-app-utils'

const ID_ORDER = [
  'settingsCategory', 'action', 'settingsId', 'page',
  'keyword', 'nextMaintenance', 'sslExpiration', 'includeArchived'
];

let inst = new PayloadUtils({
  idParts: ID_ORDER
});

export default inst;
