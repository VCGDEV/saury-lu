import {Injectable} from "@angular/core";
import {TABLE_N} from "./TABLE_N";

@Injectable()
export class DBAccessor<T extends Entity> {

  getByIdSql(entity: T) : string {
    let sql = `select`;
    // remove table property
    let properties = Object.getOwnPropertyNames(entity)
      .filter(a => a !== 'table');
    let where = 'where ';
    properties.forEach(prop => {
      if(`${entity.table.toString().toLowerCase()}Id` === prop) {
        where += `${prop.toString()}=?`;
      }
      sql+=` ${prop},`;
    });
    const lastIdx = sql.lastIndexOf(',');
    sql = sql.substr(0, lastIdx);
    sql += ` from ${entity.table} ${where}`
    return sql;
  }

}

export class Entity {
  table: TABLE_N;
}

