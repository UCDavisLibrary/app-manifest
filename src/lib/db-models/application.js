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
    this.metaTable = "application_metadata";
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
      },
      {
        dbName: 'is_archived',
        validation: {
          type: 'boolean'
        }
      },
      {
        dbName: 'app_urls',
        validation: {
          type: 'array',
          custom: this.validations.appUrls.bind(this.validations)
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
      },
      {
        dbName: 'include_archived',
        validation: {
          type: 'boolean'
        }
      }
    ]);

    this.links = new EntityFields([
      {
        dbName: 'href',
        validation: {
          type: 'string',
          required: true
        }
      },
      {
        dbName: 'label',
        validation: {
          type: 'string',
          charLimit: 100
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

    if ( !queryObject.includeArchived ){
      whereArgs.is_archived = false;
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
      SELECT
        a.*,
        json_agg(${this.metaJsonObject()}) as metadata
      FROM ${this.table} a
      LEFT JOIN ${this.metaTable} am ON a.application_id = am.application_id
      WHERE ${whereClause.sql}
      GROUP BY a.application_id
      ORDER BY a.name
      LIMIT ${pageSize} OFFSET ${(page-1)*pageSize}
    `;
    const res = await pg.query(sql, whereClause.values);
    if ( res.error ) {
      return this.formatError(res.error);
    }

    const data = res.res.rows.map(row => this._transformDbData(row));
    return {data, total, page, pageSize, totalPages};

  }

  metaJsonObject(tableAlias='am') {
    return `json_build_object(
      'applicationMetadataId', ${tableAlias}.application_metadata_id,
      'applicationId', ${tableAlias}.application_id,
      'key', ${tableAlias}.key,
      'value', ${tableAlias}.value
    )`;
  }

  _transformDbData(data){
    const metadata = data.metadata || [];
    delete data.metadata;

    data = this.entityFields.toJsonObj(data);

    data.appUrls = this.links.toJsonArray( metadata.filter(d => d.key === 'app_url').map(d => d.value) );

    const dates = ['nextMaintenance', 'sslCertExpiration'];
    for ( let date of dates ){
      if ( data[date] ) data[date] = data[date].toISOString().split('T')[0];
    }
    return data;
  }

  async update(data){
    const parsedData = this.entityFields.toDbObj(data);

    const validation = await this.entityFields.validate(parsedData);
    if ( !validation.valid ) {
      return this.formatValidationError(validation);
    }

    const applicationId = parsedData.application_id;
    delete parsedData.application_id;

    const client = await pg.pool.connect();
    try {
      await client.query('BEGIN');
      let update, sql, result;

      update = pg.prepareObjectForUpdate(parsedData);
      sql = `
        UPDATE ${this.table}
        SET ${update.sql}
        WHERE application_id = $${update.values.length + 1}
      `;
      result = await client.query(sql, [...update.values, applicationId]);

      await client.query('COMMIT');
      return { application_id: applicationId };

    } catch (error) {
      await client.query('ROLLBACK');
      return this.formatError(error);
    } finally {
      client.release();
    }
  }

  async create(data){
    const parsedData = this.entityFields.toDbObj(data);
    delete parsedData.application_id;
    const validation = await this.entityFields.validate(parsedData, { excludeFields: ['application_id'] });
    if ( !validation.valid ) {
      return this.formatValidationError(validation);
    }

    const appUrls = this.links.toDbArray(parsedData.app_urls);
    delete parsedData.app_urls;

    const client = await pg.pool.connect();
    try {
      await client.query('BEGIN');
      let insert, sql, result;

      insert = pg.prepareObjectForInsert(parsedData);
      sql = `
        INSERT INTO ${this.table}
        (${insert.keysString}) VALUES (${insert.placeholdersString})
        RETURNING application_id
      `
      result = await client.query(sql, insert.values);
      const applicationId = result.rows[0].application_id;

      // insert app urls
      if ( appUrls.length ){
        for ( const url of appUrls ){
          const d = {
            key: 'app_url',
            application_id: applicationId,
            value: url
          }
          insert = pg.prepareObjectForInsert(d);
          sql = `
            INSERT INTO ${this.metaTable}
            (${insert.keysString}) VALUES (${insert.placeholdersString})
          `;
          await client.query(sql, insert.values);
        }
      }

      await client.query('COMMIT');

      return { application_id: applicationId };

    } catch (error) {
      await client.query('ROLLBACK');
      return this.formatError(error);
    } finally {
      client.release();
    }
  }

  async delete(applicationId){
    const parsedData = this.entityFields.toDbObj({applicationId});
    const validation = await this.entityFields.validate(parsedData, { includeFields: ['application_id'] });
    if ( !validation.valid ) {
      return this.formatValidationError(validation);
    }

    let sql = `
      DELETE FROM ${this.table}
      WHERE application_id = $1
    `;
    const result = await pg.query(sql, [applicationId]);
    if ( result.error ) {
      return this.formatError(result.error);
    }
    return { applicationId };
  }
}

export default new Application();
