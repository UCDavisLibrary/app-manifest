import pg from "./pg.js";
import EntityFields from "../utils/entity/EntityFields.js";
import BaseModel from "./BaseModel.js";
import ApplicationValidations from './ApplicationValidations.js';
import typeTransfrom from '../utils/typeTransform.js';
import config from '../serverConfig.js';
import selectOptions from "../utils/selectOptions.js";

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
      },
      {
        dbName: 'description',
        validation: {
          charLimit: 1000
        }
      },
      {
        dbName: 'maintenance_interval',
        validation: {
          type: 'non-negative-integer'
        }
      },
      {
        dbName: 'next_maintenance',
        validation: {
          type: 'iso-date'
        }
      },
      {
        dbName: 'ssl_cert_expiration',
        validation: {
          type: 'iso-date'
        }
      },
      {
        dbName: 'cert_check_disabled',
        validation: {
          type: 'boolean'
        }
      }
    ]);

    this.queryArgs = new EntityFields([
      {
        dbName: 'page',
        validation: {
          type: 'positive-integer'
        }
      },
      {
        dbName: 'keyword',
        validation: {
          type: 'string',
        }
      },
      {
        dbName: 'next_maintenance',
        validation: {
          type: 'string',
          custom: this.validations.nextMaintenance.bind(this.validations)
        }
      },
      {
        dbName: 'ssl_expiration',
        validation: {
          type: 'string',
          custom: this.validations.sslExpiration.bind(this.validations)
        }
      },
      {
        dbName: 'application_id',
        validation: {
          type: 'positive-integer'
        }
      }
    ]);
  }

  async query(queryObject={}){

    // validate query
    const parsedQuery = this.queryArgs.toDbObj(queryObject);
    const validation = await this.queryArgs.validate(parsedQuery);
    if ( !validation.valid ) {
      return this.formatValidationError(validation);
    }

    const page = typeTransfrom.toPositiveInt(queryObject.page) || 1;

    const pageSize = config.getPageSize('application');
    const whereArgs = {'1': '1'};

    if ( queryObject.keyword ){
      whereArgs.keyword = {
        relation: 'OR',
        name: {
          operator: 'ILIKE',
          value: `%${queryObject.keyword}%`
        },
        description: {
          operator: 'ILIKE',
          value: `%${queryObject.keyword}%`
        }
      }
    }

    if ( queryObject.applicationId ){
      whereArgs.application_id = queryObject.applicationId;
    }

    const whereClause = pg.toWhereClause(whereArgs);

    if ( queryObject.nextMaintenance ){
      const interval = selectOptions.maintenanceIntervals.find(interval => interval.value === queryObject.nextMaintenance);
      if ( interval.sql ) {
        whereClause.sql += ` AND next_maintenance ${interval.sql.operator} ${interval.sql.value}`;
      }
    }

    if ( queryObject.sslExpiration ){
      const interval = selectOptions.sslExpirationIntervals.find(interval => interval.value === queryObject.sslExpiration);
      if ( interval.sql ) {
        whereClause.sql += ` AND ssl_cert_expiration ${interval.sql.operator} ${interval.sql.value}`;
      }
    }

    const countSql = `
      SELECT COUNT(*) as total
      FROM ${this.table} a
      WHERE ${whereClause.sql}
    `;
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
