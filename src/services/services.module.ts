import {NgModule} from "@angular/core";
import {DBProvider} from "./db/db.provider";
import {CategoryService} from "./category/category.service";
import {UuidProvider} from "./db/uuid.provider";

@NgModule({
  providers: [
    UuidProvider,
    DBProvider,
    CategoryService
  ]
})
export class ServicesModule {

}
