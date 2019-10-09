import {DBAccessor} from "../db/db.accessor";
import {Category} from "../model/category";
import {DBProvider} from "../db/db.provider";
import {Injectable} from "@angular/core";
import {CrudRepository} from "../db/crud.repository";
import {UuidProvider} from "../db/uuid.provider";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class CategoryService extends DBAccessor<Category>
  implements CrudRepository<Category>
  {

  private _catEmptyErr:string = 'Category name should not be empty';
  private _catActiveOrInactiveErr: string = 'Category should be set as active or inactive';
  private _idNotNull: string = 'Id should not be null';
  constructor(private _db: DBProvider,
              private _idProv: UuidProvider,
              private translate: TranslateService) {
    super();
    this.translate.get(this._catEmptyErr)
      .subscribe( (next: string ) => this._catEmptyErr = next );
    this.translate.get(this._catActiveOrInactiveErr)
      .subscribe( (next: string ) => this._catActiveOrInactiveErr = next );
    this.translate.get(this._idNotNull)
      .subscribe(next => this._idNotNull = next);
  }

  save(category: Category): Promise<boolean> {
    category.categoryId = this._idProv.id();
    const query = this._createInsertQuery(category);
    const params = this._getValues(category);
    const errs = this.validate(category);
    if(errs.length > 0){
      return Promise.reject(errs);
    } else {
      return new Promise<boolean>((resolve, reject) => {
        this._db.query(query, params)
          .then(() => resolve(true))
          .catch(err => {
            reject(false);
          });
      });
    }
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
    const arrErrors = this.validate(category, true);
    if(arrErrors.length > 0) {
      return Promise.reject(arrErrors);
    } else {
      return new Promise<Category>((resolve, reject) => {
        const updateQuery = this._createUpdateQuery(category);
        const params = this._getValues(category)
          .filter(value => value !== category.categoryId);
        params.push(category.categoryId);
        this._db.update(updateQuery, params)
          .then(() => resolve(category))
          .catch((err) =>{
           console.log(err);
          });
      });
    }
  }

  private validate(category: Category, update:boolean = false): Array<string> {
    const arrayErrs:Array<string> = new Array<string>();

    if(update && (!category.categoryId || category.categoryId === '') ){
      arrayErrs.push(this._idNotNull);
    }

    if(!category.categoryName || category.categoryName === '') {
      arrayErrs.push(this._catEmptyErr);
    }
    if (category.isActive === undefined) {
      arrayErrs.push(this._catActiveOrInactiveErr);
    }
    return arrayErrs;
  }
}
