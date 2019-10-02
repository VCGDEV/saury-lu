import {DBAccessor, Entity} from "./db.accessor";
import {TABLE_N} from "./TABLE_N";

describe('DatabaseAccessor', () => {
  const dbAccesss:DBAccessor<System> = new DBAccessor();

  it('should create get by id query', () =>{
    const expectedSQL = `select systemId, name from ${TABLE_N.System} where systemId=?`;
    const query = dbAccesss._createGetByIdQuery(new System());
    expect(expectedSQL).toEqual(query);
  });

  it('should create insert query', () =>{
    const expectedSQL = `insert into ${TABLE_N.System}(systemId, name) values(?, ?)`;
    const query = dbAccesss._createInsertQuery(new System());
    expect(expectedSQL).toEqual(query);
  });

});

class System extends  Entity {
  table: TABLE_N = TABLE_N.System;
  systemId: string = '';
  name: string = '';
}
