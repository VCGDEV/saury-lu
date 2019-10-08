import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AddCategoryComponent} from "./add/add.category.component";
import {CategoryService} from "../../services/category/category.service";
import {Category} from "../../services/model/category";
import {TranslateService} from "@ngx-translate/core";
import {UpdateCategoryComponent} from "./update/update.category.component";

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  public categories: Array<Category> = [];
  private _loadingMsg = 'Loading categories';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public categoryService: CategoryService,
              public translate: TranslateService,
              public loadingCtrl: LoadingController) {
    this.translate.get(this._loadingMsg)
      .subscribe((next: string) => this._loadingMsg = next);
  }

  ionViewDidEnter() {
    const loading = this.loadingCtrl.create({
      content: this._loadingMsg,
      dismissOnPageChange: true
    });
    loading.present({animate: true});
    this.categoryService.findAll()
      .then((res) => {
        this.categories = res;
        loading.dismiss();
      })
      .catch(err => {
        loading.dismiss();
      });
  }

  createCategory() {
    this.navCtrl.push(AddCategoryComponent);
  }

  itemTapped(event, item) {
    this.navCtrl.push(UpdateCategoryComponent, {category: item});
  }
}
