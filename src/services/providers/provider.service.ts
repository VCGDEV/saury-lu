import { DBAccessor } from "../db/db.accessor";
import { CrudRepository } from "../db/crud.repository";
import { Provider } from "../model/provider";
import { Injectable } from "@angular/core";
import { DBProvider } from "../db/db.provider";
import { UuidProvider } from "../db/uuid.provider";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class ProviderService extends DBAccessor<Provider>
  implements CrudRepository<Provider> {

  constructor(private _db: DBProvider, private _idProvider: UuidProvider,
              private _translate: TranslateService) {
    super();
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
        }).catch(err => reject(false));
    });
  }

  findById(id: string): Promise<Provider> {
    return undefined;
  }

  save(arg: Provider): Promise<boolean> {
    return undefined;
  }

  update(arg: Provider): Promise<Provider> {
    return undefined;
  }



}
