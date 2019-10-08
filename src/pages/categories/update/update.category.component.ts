import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Category} from "../../../services/model/category";
import {CategoryService} from "../../../services/category/category.service";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'page-update-category',
  templateUrl: 'update.category.component.html',
})
export class UpdateCategoryComponent {

  public category: Category = new Category();
  public errMsg: string = 'Could not update category, please try later';
  public waitMsg: string = 'Please wait';
  public okMsg: string = 'OK';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadCtrl: LoadingController,
              public alertCtrl: AlertController,
              private categoryService: CategoryService,
              public translate: TranslateService) {

    this.translate.get(this.errMsg)
      .subscribe(next => this.errMsg = next);

    this.translate.get(this.waitMsg)
      .subscribe(next => this.waitMsg = next);

    this.translate.get(this.okMsg)
      .subscribe(next => this.okMsg = next);
  }

  ionViewDidLoad() {
    this.category = this.navParams.get('category');
  }

  updateCategory() {
    let loading = this.loadCtrl.create({
      content: this.waitMsg
    });
    loading.present();
    this.categoryService.update(this.category)
      .then(res=> {
        loading.dismiss();
        this.navCtrl.pop()
      })
      .catch(err=>{
        loading.dismiss()
          .then(()=>{
            const alert = this.alertCtrl.create({
              buttons: [this.okMsg],
              message: this.errMsg,
              title: 'Error',
            });
            alert.present();
          });
      });
  }

  isCategoryValid(): boolean{
    return this.category.categoryName === '';
  }
}
