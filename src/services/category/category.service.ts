import {DBAccessor} from "../db/db.accessor";
import {Category} from "../model/category";
import {DBProvider} from "../db/db.provider";
import {Injectable} from "@angular/core";
import {CrudRepository} from "../db/crud.repository";
import {UuidProvider} from "../db/uuid.provider";

@Injectable()
export class CategoryService extends DBAccessor<Category>
  implements CrudRepository<Category>
  {

  constructor(private _db: DBProvider,
              private _idProv: UuidProvider) {
    super();
  }

  save(category: Category): Promise<boolean> {
    category.categoryId = this._idProv.id();
    const query = this._createInsertQuery(category);
    const params = this._getValues(category);
    return new Promise<boolean>((resolve, reject) => {
      const errs = this.validate(category);
      if(errs.length > 1) {
        reject(errs);
      }
      this._db.query(query, params)
        .then(() => resolve(true))
        .catch(err => {
          reject(false);
        });
    });
  }

  findAll(): Promise<Array<Category>> {
    const category = new Category();
    const sql:string = this._createFindAllQuery(category);
    return new Promise<Array<Category>>((resolve, reject) => {
      this._db.query(sql, [])
        .then((res) => {
          const data = this._db.parseData(res);
          let result: Array<Category> = new Array<Category>();
          for(let row = 0; row < data.length; row++) {
              const item = data.item(row);
              const category = new Category();
              category.isActive = item.is_active === 'true';
              category.categoryName = item.category_name;
              category.categoryId = item.category_id;
              category.imageFile = item.image_file;
              result.push(category);
          }
          resolve(result);
        })
        .catch(err => reject(false));
    });
  }

  findById(id: string): Promise<Category> {
    return Promise.reject('');
  }

  update(category: Category): Promise<Category> {
    return Promise.reject('');
  }

  private validate(category: Category): Array<string> {
    const arrayErrs:Array<string> = new Array<string>();
    if(!category.categoryName || category.categoryName === '') {
      arrayErrs.push(`Category name should not be empty`);
    }
    if (category.isActive === undefined) {
      arrayErrs.push(`Category should be set as active or inactive`);
    }
    return arrayErrs;
  }
}
