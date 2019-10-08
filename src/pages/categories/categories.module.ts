import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesPage } from './categories';
import {AddCategoryComponent} from "./add/add.category.component";
import {TranslateModule} from "@ngx-translate/core";
import {UpdateCategoryComponent} from "./update/update.category.component";

@NgModule({
  declarations: [
    CategoriesPage,
    AddCategoryComponent,
    UpdateCategoryComponent
  ],
  imports: [
    IonicPageModule.forChild(CategoriesPage),
    TranslateModule.forChild()
  ],
  entryComponents: [
    CategoriesPage,
    AddCategoryComponent,
    UpdateCategoryComponent
  ]
})
export class CategoriesPageModule {}
