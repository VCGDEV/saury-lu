import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Category} from "../../../services/model/category";
import {CategoryService} from "../../../services/category/category.service";


@Component({
  selector: 'page-add-category',
  templateUrl: 'add.category.component.html',
})
export class AddCategoryComponent {

  public category: Category = new Category();
  public errMsg: string = '';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadCtrl: LoadingController,
              public alertCtrl: AlertController,
              private categoryService: CategoryService) {
  }

  ionViewDidLoad() {
    this.errMsg = '';
    console.log('ionViewDidLoad AddCategoryComponent');
  }

  createCategory() {
    let loading = this.loadCtrl.create({
      content: `Please wait`
    });
    loading.present();
    this.categoryService.save(this.category)
      .then(res=> {
        loading.dismiss();
        this.navCtrl.pop()
      })
      .catch(err=>{
        this.errMsg = 'Could not create category, please try later';
        loading.dismiss()
          .then(()=>{
            const alert = this.alertCtrl.create({
              buttons: ['OK'],
              message: this.errMsg
            });
            alert.present();
          });
      });
  }

  isCategoryValid(): boolean{
    return this.category.categoryName === '';
  }
}
