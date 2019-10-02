import {DBAccessor, Entity} from "./db.accessor";
import {TABLE_N} from "./TABLE_N";

describe('DatabaseAccessor', () => {
  const dbAccesss:DBAccessor<System> = new DBAccessor();

  it('should create get by id query', () =>{
    const expectedSQL = `select systemId, name from ${TABLE_N.System.toString()} where systemId=?`;
    const query = dbAccesss.getByIdSql(new System());
    expect(expectedSQL).toEqual(query);
  });

});

class System extends  Entity {
  table: TABLE_N = TABLE_N.System;
  systemId: string = '';
  name: string = '';
}
