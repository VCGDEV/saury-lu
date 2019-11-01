import { DBAccessor } from "../db/db.accessor";
import { CrudRepository } from "../db/crud.repository";
import { Provider } from "../model/provider";
import { Injectable } from "@angular/core";
import { DBProvider } from "../db/db.provider";
import { UuidProvider } from "../db/uuid.provider";
import { TranslateService } from "@ngx-translate/core";
import {DBError} from "../db/db.error";

@Injectable()
export class ProviderService extends DBAccessor<Provider>
  implements CrudRepository<Provider> {
  private _err =
    {
      dbErrors: {
        selectError: new DBError('selectError','Could not get result from DB'),
        noResults: new DBError('noResults','No records were found in DB'),
        multipleResults: new DBError('multipleResults','Multiple records were found for your query')
      },
      validations: {
        emptyId: new  DBError('emptyId','Id to search should not be empty')
      }
    };
  constructor(private _db: DBProvider, private _idProvider: UuidProvider,
              private _translate: TranslateService) {
    super();
    this._translate.get('validations.emptyId')
      .subscribe(value => this._err.validations.emptyId.description = value);

    this._translate.get('dbErrors.selectError')
      .subscribe(value => this._err.dbErrors.selectError.description = value);

    this._translate.get('dbErrors.selectError')
      .subscribe(value => this._err.dbErrors.noResults.description = value);

    this._translate.get('dbErrors.selectError')
      .subscribe(value => this._err.dbErrors.multipleResults.description = value);
  }

  findAll(): Promise<Array<Provider>> {
    const sql = this._createFindAllQuery(new Provider());
    return new Promise<Array<Provider>>((resolve, reject) => {
      this._db.query(sql, [])
        .then(res => {
          const data = this._db.parseData(res);
          let result: Array<Provider> = new Array<Provider>();
          for(let row = 0; row < data.length; row++) {
            const item = data.item(row);
            const provider = new Provider();
            provider.isActive = item.is_active === 'true';
            provider.description = item.description;
            provider.providerId = item.provider_id;
            result.push(provider);
          }
          resolve(result);
        }).catch(err => reject({ error: this._err.dbErrors.selectError}));
    });
  }

  findById(id: string): Promise<Provider> {
    if(id && id.trim() === '') {
      console.log(id);
      return Promise.reject({error: this._err.validations.emptyId });
    }
    const provider = new Provider();
    const sql = this._createGetByIdQuery(provider);
    return new Promise<Provider>((resolve, reject) => {
      this._db.findOne(sql, [id])
        .then(res => {
          const data = this._db.parseData(res);
          if( data.length == 0) {
            reject( { error: this._err.dbErrors.noResults } );
          } else if ( data.length >1 ) {
            reject( { error: this._err.dbErrors.noResults } );
          } else {
            const item = data.item(0);
            provider.isActive = item.is_active === 'true';
            provider.description = item.description;
            provider.providerId = item.provider_id;
            resolve(provider);
          }
        })
        .catch(() => reject({ error: this._err.dbErrors.selectError }));
    });
  }

  save(arg: Provider): Promise<boolean> {
    return undefined;
  }

  update(arg: Provider): Promise<Provider> {
    return undefined;
  }


  get errors():any {
    return this._err;
  }
}
