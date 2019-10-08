import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesPage } from './categories';
import {AddCategoryComponent} from "./add/add.category.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    CategoriesPage,
    AddCategoryComponent,
  ],
  imports: [
    IonicPageModule.forChild(CategoriesPage),
    TranslateModule.forChild()
  ],
  entryComponents: [
    CategoriesPage,
    AddCategoryComponent
  ]
})
export class CategoriesPageModule {}
