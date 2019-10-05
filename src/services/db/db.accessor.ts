import {Injectable} from "@angular/core";
import {Entity} from "./entity";

@Injectable()
export class DBAccessor<T extends Entity> {

  _createGetByIdQuery(entity: T) : string {
    let sql = `select`;
    let properties = this._getProperties(entity);
    properties = properties.map(this._replacePropName);
    let where = 'where ';
    const entityTableId = `${this._replacePropName(entity.table).toString()}_id`;
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

  private _getProperties(entity: T): Array<any> {
    return Object.getOwnPropertyNames(entity)
      .filter(a => a !== 'table');
  }

  _getValues(entity: T): Array<any> {
    const props = this._getProperties(entity);
    return props.map(prop => entity[prop]);
  }

  _createInsertQuery(entity: T) {
    let properties = this._getProperties(entity);
    properties = properties.map(this._replacePropName);
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

  _createFindAllQuery(entity: T): string {
    let properties = this._getProperties(entity);
    let sql = `select `;
    properties = properties.map(this._replacePropName);
    properties.forEach(prop => sql += `${prop}, `);
    return `${this._replaceLastComma(sql)} from ${entity.table}`;
  }
  private _replacePropName(prop: string) {
    return prop.replace(/(?:^|\.?)([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "");
  }

  private _replaceLastComma(sql: string) {
    const lastIdx = sql.lastIndexOf(',');
    return sql.substr(0, lastIdx);
  }
}

