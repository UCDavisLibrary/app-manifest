import pg from './pg.js';
import selectOptions from '../utils/selectOptions.js';

export default class ApplicationValidations {

  constructor(model){
    this.model = model;
  }

  async applicationId(field, value, validator){
    if ( validator.fieldHasError(field) ) return;
    const sql = `
      SELECT id FROM ${this.model.table} WHERE id = $1
    `;
    const result = await pg.query(sql, [value]);
    if ( !result.res.rowCount ) {
      validator.addError(field, 'invalid', 'Application does not exist.');
    }
  }

  nextMaintenance(field, value, validator){
    if ( validator.fieldHasError(field) ) return;
    if ( value === undefined || value === null ) return;

    if ( !selectOptions.maintenanceIntervals.find(interval => interval.value === value) ) {
      validator.addError(field, 'invalid', 'Invalid maintenance interval');
    }
  }
}
