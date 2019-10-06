import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AddCategoryComponent} from "./add/add.category.component";
import {CategoryService} from "../../services/category/category.service";
import {Category} from "../../services/model/category";

/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  public categories: Array<Category> = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public categoryService: CategoryService,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CategoriesPage');
    const loading = this.loadingCtrl.create({
      content: 'Loading categories',
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
        console.error( `could not get data`, err)
      });
  }

  createCategory() {
    console.log(`go to create cat component`);
    this.navCtrl.push(AddCategoryComponent);
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    console.log(item);
  }
}
