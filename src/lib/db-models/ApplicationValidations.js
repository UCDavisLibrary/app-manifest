import pg from './pg.js';

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
}
