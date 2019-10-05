import {DBAccessor} from "../db/db.accessor";
import {Category} from "../model/category";
import {DBProvider} from "../db/db.provider";
import {Injectable} from "@angular/core";

@Injectable()
export class CategoryService extends DBAccessor<Category> {

  constructor(private _db: DBProvider) {
    super();
  }

  save(category: Category): Promise<boolean> {
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
