import {Injectable} from "@angular/core";
import {Platform} from "ionic-angular";
import {TABLE_N} from "./TABLE_N";

const DB_NAME: string = 'sy_db';
const win: any = window;

const TABLE_NAMES = [
  `create table if not exists ${TABLE_N.Category}(category_id varchar(36) primary key,
    category_name varchar(100) not null,
    is_active boolean not null,
    image_file varchar(250)
    )`
];


@Injectable()
export class DBProvider {
  private _dbPromise: Promise<any>;

  constructor(public platform: Platform) {
    this._dbPromise = new Promise<any>((resolve, reject) => {
      try{
        let _db: any;
        this.platform.ready()
          .then(() => {
            if (this.platform.is('cordova') && win.sqlitePlugin) {
              _db = win.sqlitePlugin.openDatabase({
                name: DB_NAME,
                location: 'default'
              });
            } else {
              //FOR WEBSQL
              _db = win.openDatabase(DB_NAME, '1.0', 'database', 5 * 1024 * 1024);
            }
            resolve(_db);
          })
          .catch(err => {
            reject({error: err});
          } );
      } catch (e) {
        reject({error: e});
      }
    });
    this._initDB();
  }

  _initDB() {
    for (let i = 0; i < TABLE_NAMES.length ; i++) {
      console.log(TABLE_NAMES[i]);
      this.query(TABLE_NAMES[i], [])
        .then(() => console.info(`Table created: ${i}`))
        .catch(err => console.error(`could not create table`, err));
    }
  }

  query(query: string, params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this._dbPromise.then(db => {
          db.transaction((tx: any) => {
              tx.executeSql(query, params,
                (tx: any, res: any) => resolve({tx: tx, res: res}),
                (tx: any, err: any) => reject({tx: tx, err: err}));
            },
            (err: any) => reject({err: err}));
        });
      } catch (err) {
        reject({err: err});
      }
    });
  }
}
