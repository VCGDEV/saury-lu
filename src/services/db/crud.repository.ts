import {Entity} from "./entity";
import {DBError} from "./db.error";

export interface CrudRepository<T extends Entity> {
   save(arg: T): Promise<boolean>;
   findAll(): Promise<Array<T>>;
   findById(id: string): Promise<T>;
   update(arg: T): Promise<T>;
   validate(arg: T, update: boolean): Array<DBError>;
 }
