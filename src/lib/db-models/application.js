import pg from "./pg.js";
import EntityFields from "../utils/entity/EntityFields.js";
import BaseModel from "./BaseModel.js";
import ApplicationValidations from './ApplicationValidations.js';
import typeTransfrom from '../utils/typeTransform.js';
import config from '../serverConfig.js';

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

  async query(queryObject={}){
    const page = typeTransfrom.toPositiveInt(queryObject.page) || 1;

    const pageSize = config.getPageSize('application');
    const whereArgs = {'1': '1'};
    const whereClause = pg.toWhereClause(whereArgs);

    const countSql = `
      SELECT COUNT(*) as total
      FROM ${this.table} a
      WHERE ${whereClause.sql}
    `
    const countRes = await pg.query(countSql, whereClause.values);
    if ( countRes.error ) {
      return this.formatError(countRes.error);
    }
    const total = Number(countRes.res.rows[0].total);
    const totalPages = Math.ceil(total/pageSize);

    const sql = `
      SELECT a.*
      FROM ${this.table} a
      WHERE ${whereClause.sql}
      ORDER BY a.name
      LIMIT ${pageSize} OFFSET ${(page-1)*pageSize}
    `;
    const res = await pg.query(sql, whereClause.values);
    if ( res.error ) {
      return this.formatError(res.error);
    }

    const data = this.entityFields.toJsonArray(res.res.rows);
    return {data, total, page, pageSize, totalPages};

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
