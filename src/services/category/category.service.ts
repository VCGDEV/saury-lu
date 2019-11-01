import {DBAccessor} from "../db/db.accessor";
import {Category} from "../model/category";
import {DBProvider} from "../db/db.provider";
import {Injectable} from "@angular/core";
import {CrudRepository} from "../db/crud.repository";
import {UuidProvider} from "../db/uuid.provider";
import {TranslateService} from "@ngx-translate/core";
import {DBError} from "../db/db.error";

@Injectable()
export class CategoryService extends DBAccessor<Category>
  implements CrudRepository<Category>
  {

    _err =
      {
        dbErrors: {
          selectError: new DBError('001','Could not get result from DB'),
          noResults: new DBError('002','No records were found in DB'),
          multipleResults: new DBError('003','Multiple records were found for your query'),
          insertError: new DBError('004','Could not save object into DB'),
          updateError: new DBError('005','Could not update object into DB')
        },
        validations: {
          emptyId: new  DBError('100','Id should not be empty'),
          categoryNameEmpty: new  DBError('101','Category name should not be empty'),
          categoryStatus: new  DBError('102','Category should be set as active or inactive'),
          nullObject: new  DBError('103','Value should not be null'),
        }
      };

  constructor(private _db: DBProvider,
              private _idProv: UuidProvider,
              private translate: TranslateService) {
    super();
    this.parseErrors(this.translate);
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
            reject({ error: this._err.dbErrors.insertError });
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
        .catch(err => reject({ error: this._err.dbErrors.selectError }));
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
          .catch((err) => reject({ error: this._err.dbErrors.updateError }) );
      });
    }
  }

  validate(category: Category, update:boolean = false): Array<DBError> {
    const arrayErrs:Array<DBError> = new Array<DBError>();

    if(!category) {
      arrayErrs.push(this._err.validations.nullObject);
      return arrayErrs;
    }

    if(update && (!category.categoryId || category.categoryId === '') ){
      arrayErrs.push(this._err.validations.emptyId);
    }

    if(!category.categoryName || category.categoryName === '') {
      arrayErrs.push(this._err.validations.categoryNameEmpty);
    }
    if (category.isActive === undefined) {
      arrayErrs.push(this._err.validations.categoryStatus);
    }
    return arrayErrs;
  }

  get errors(): any {
    return this._err;
  }
}
