import {Entity} from "../db/entity";
import {TABLE_N} from "../db/TABLE_N";

export class Category extends Entity{
  table: TABLE_N = TABLE_N.Category;
  id: string = '';
  categoryName: string = '';
  isActive: boolean = false;
  imageFile: string = '';
}
