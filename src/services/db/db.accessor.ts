import {Injectable} from "@angular/core";
import {Entity} from "./entity";

@Injectable()
export class DBAccessor<T extends Entity> {

  _createGetByIdQuery(entity: T) : string {
    let sql = `select`;
    let properties = this._getProperties(entity)
      .map(this.toSnakeCase);
    let where = 'where ';
    const entityTableId = `${this.toSnakeCase(entity.table).toString()}_id`;
    properties.forEach(prop => {
      if(entityTableId === prop) {
        where += `${prop.toString()}=?`;
      }
      sql+=` ${prop},`;
    });
    sql = this._replaceLastComma(sql);
    sql += ` from ${entity.table} ${where}`
    return sql;
  }

  _getProperties(entity: T): Array<any> {
    return Object.getOwnPropertyNames(entity)
      .filter(a => a !== 'table');
  }

  _getValues(entity: T): Array<any> {
    return this._getProperties(entity)
      .map(prop => entity[prop]);
  }

  _createInsertQuery(entity: T) {
    let properties = this._getProperties(entity)
      .map(this.toSnakeCase);
    let sql = `insert into ${entity.table}(`;
    let values = 'values(';
    properties.forEach(prop => {
      sql += `${prop}, `;
      values += '?, ';
    });
    sql = `${this._replaceLastComma(sql)})`;
    values = `${this._replaceLastComma(values)})`;
    return `${sql} ${values}`;
  }

  _createUpdateQuery(entity: T) {

    const entityTableId = `${this.toSnakeCase(entity.table).toString()}_id`;
    const properties = this._getProperties(entity)
      .map(this.toSnakeCase)
      .filter(prop => prop !== entityTableId);

    let sql = '';

    properties.forEach(prop => {
      sql+=` ${prop}=?,`;
    });

    return `update ${entity.table} set${this._replaceLastComma(sql)} where ${entityTableId}=?`;
  }

  _createFindAllQuery(entity: T): string {
    let properties = this._getProperties(entity);
    let sql = `select `;
    properties = properties.map(this.toSnakeCase);
    properties.forEach(prop => sql += `${prop}, `);
    return `${this._replaceLastComma(sql)} from ${entity.table}`;
  }

  toSnakeCase(prop: string) {
    return prop.replace(/(?:^|\.?)([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "");
  }

  private _replaceLastComma(sql: string) {
    const lastIdx = sql.lastIndexOf(',');
    return sql.substr(0, lastIdx);
  }
}

