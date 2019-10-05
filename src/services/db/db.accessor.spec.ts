import {DBAccessor} from "./db.accessor";
import {TABLE_N} from "./TABLE_N";
import {Entity} from "./entity";
const uuid = 'b671a64-40d5-491e-99b0-da01ff1f3341';

describe('DatabaseAccessor', () => {
  const dbAccesss:DBAccessor<System> = new DBAccessor();

  it('should create get by id query', () =>{
    const expectedSQL = `select system_id, system_name from ${TABLE_N.System} where system_id=?`;
    const query = dbAccesss._createGetByIdQuery(new System());
    expect(query).toEqual(expectedSQL);
  });

  it('should create insert query', () =>{
    const expectedSQL = `insert into ${TABLE_N.System}(system_id, system_name) values(?, ?)`;
    const query = dbAccesss._createInsertQuery(new System());
    expect(query).toEqual(expectedSQL);
  });

  it('should create find all query', () =>{
    const expectedSQL = `select system_id, system_name from ${TABLE_N.System}`;
    const query = dbAccesss._createFindAllQuery(new System());
    expect(query).toEqual(expectedSQL);
  });

  it('should extract entity values', () =>{

    const system = new System();
    system.systemName = 'name';
    system.systemId = uuid;
    const expectedValues = [system.systemId, 'name'];

    const values = dbAccesss._getValues(system);
    expect(values).toEqual(expectedValues);
  });

});

class System extends  Entity {
  table: TABLE_N = TABLE_N.System;
  systemId: string = '';
  systemName: string = '';
}
