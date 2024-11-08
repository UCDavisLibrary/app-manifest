import pg from "./pg.js";
import EntityFields from "../utils/entity/EntityFields.js";
import BaseModel from "./BaseModel.js";
import ApplicationValidations from './ApplicationValidations.js';

class Application extends BaseModel {

  constructor(){
    super();
    this.validations = new ApplicationValidations(this);
    this.table = "application";
    this.entityFields = new EntityFields([
      {
        dbName: 'application_id',
        validation: {
          required: true,
          type: 'positive-integer',
          custom: this.validations.applicationId.bind(this.validations)
        }
      },
      {
        dbName: 'name',
        validation: {
          required: true,
          charLimit: 200
        }
      }
    ]);
  }

  async create(data){
    const parsedData = this.entityFields.toDbObj(data);
    delete parsedData.application_id;
    const validation = await this.entityFields.validate(parsedData, { excludeFields: ['application_id'] });
    if ( !validation.valid ) {
      return this.formatValidationError(validation);
    }

    const client = await pg.pool.connect();
    try {
      let insert, sql, result;

      insert = pg.prepareObjectForInsert(parsedData);
      sql = `
        INSERT INTO ${this.table}
        (${insert.keysString}) VALUES (${insert.placeholdersString})
        RETURNING application_id
      `
      result = await client.query(sql, insert.values);
      const applicationId = result.rows[0].application_id;

      return { application_id: applicationId };

    } catch (error) {
      await client.query('ROLLBACK');
      return this.formatError(error);
    } finally {
      client.release();
    }
  }
}

export default new Application();
