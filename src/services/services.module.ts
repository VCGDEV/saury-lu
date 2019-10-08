import {NgModule} from "@angular/core";
import {DBProvider} from "./db/db.provider";
import {CategoryService} from "./category/category.service";
import {UuidProvider} from "./db/uuid.provider";
import {TranslateService} from "@ngx-translate/core";

@NgModule({
  providers: [
    UuidProvider,
    DBProvider,
    TranslateService,
    CategoryService
  ]
})
export class ServicesModule {

}
