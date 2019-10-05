import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesPage } from './categories';
import {AddCategoryComponent} from "./add/add.category.component";

@NgModule({
  declarations: [
    CategoriesPage,
    AddCategoryComponent,
  ],
  imports: [
    IonicPageModule.forChild(CategoriesPage)
  ],
  entryComponents: [
    CategoriesPage,
    AddCategoryComponent
  ]
})
export class CategoriesPageModule {}
