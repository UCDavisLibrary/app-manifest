import pg from './pg.js';
import selectOptions from '../utils/selectOptions.js';

export default class ApplicationValidations {

  constructor(model){
    this.model = model;
  }

  async applicationId(field, value, validator){
    if ( validator.fieldHasError(field) ) return;
    const sql = `
      SELECT application_id FROM ${this.model.table} WHERE application_id = $1
    `;
    const result = await pg.query(sql, [value]);
    if ( !result.res.rowCount ) {
      validator.addError(field, 'invalid', 'Application does not exist.');
    }
  }

  async appUrls(field, value, validator){
    for ( const [i, url] of value.entries() ) {
      const validation = await this.model.links.validate(url);
      if ( !validation.valid ) {
        validator.mergeFieldsWithErrors(validation.fieldsWithErrors, `${field.jsonName}[${i}]`);
      }
    }
  }

  nextMaintenance(field, value, validator){
    if ( validator.fieldHasError(field) ) return;
    if ( value === undefined || value === null ) return;

    if ( !selectOptions.maintenanceIntervals.find(interval => interval.value === value) ) {
      validator.addError(field, 'invalid', 'Invalid maintenance interval');
    }
  }

  sslExpiration(field, value, validator){
    if ( validator.fieldHasError(field) ) return;
    if ( value === undefined || value === null ) return;

    if ( !selectOptions.sslExpirationIntervals.find(interval => interval.value === value) ) {
      validator.addError(field, 'invalid', 'Invalid SSL expiration interval');
    }
  }
}
