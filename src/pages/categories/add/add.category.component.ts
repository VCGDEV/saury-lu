import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Category} from "../../../services/model/category";
import {CategoryService} from "../../../services/category/category.service";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'page-add-category',
  templateUrl: 'add.category.component.html',
})
export class AddCategoryComponent {

  public category: Category = new Category();
  public errMsg: string = 'Could not create category, please try later';
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
    this.errMsg = '';
  }

  createCategory() {
    let loading = this.loadCtrl.create({
      content: this.waitMsg
    });
    loading.present();
    this.categoryService.save(this.category)
      .then(res=> {
        loading.dismiss();
        this.navCtrl.pop()
      })
      .catch(err=>{
        this.errMsg = '';
        loading.dismiss()
          .then(()=>{
            const alert = this.alertCtrl.create({
              buttons: [this.okMsg],
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
