import {NgModule} from "@angular/core";
import {DBProvider} from "./db/db.provider";
import {CategoryService} from "./category/category.service";

@NgModule({
  providers: [
    DBProvider,
    CategoryService
  ]
})
export class ServicesModule {

}
