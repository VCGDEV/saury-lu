import {Entity} from "../db/entity";
import {TABLE_N} from "../db/TABLE_N";

export class Provider extends Entity{
  table: TABLE_N = TABLE_N.Provider;
  providerId: string = '';
  description: string = '';
  isActive: boolean = false;
}
