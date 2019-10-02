import {Injectable} from "@angular/core";
import {TABLE_N} from "./TABLE_N";

@Injectable()
export class DBAccessor<T extends Entity> {

  _createGetByIdQuery(entity: T) : string {
    let sql = `select`;
    // remove table property
    const properties = this._getProperties(entity);
    let where = 'where ';
    properties.forEach(prop => {
      if(`${entity.table.toString().toLowerCase()}Id` === prop) {
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

  _createInsertQuery(entity: T) {
    const properties = this._getProperties(entity);
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
    const properties = this._getProperties(entity);
    let sql = `select `;
    properties.forEach(prop => sql += `${prop}, `);
    return `${this._replaceLastComma(sql)} from ${entity.table}`;
  }

  private _replaceLastComma(sql: string) {
    const lastIdx = sql.lastIndexOf(',');
    return sql.substr(0, lastIdx);
  }
}

export class Entity {
  table: TABLE_N;
}

