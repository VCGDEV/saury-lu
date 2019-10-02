import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TranslateService } from '@ngx-translate/core';
import {DBProvider} from "../services/db.provider";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}> = [];

  constructor(public platform: Platform, public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public translateService: TranslateService,
              public dbProvider: DBProvider) {

    this.initializeApp();

    this.translateService.setDefaultLang("es");
    const pages = [
      { title: 'Home', component: HomePage },
      { title: 'Sign in', component: ListPage },
      { title: 'Products', component: ListPage },
      { title: 'Categories', component: ListPage },
      { title: 'Products', component: ListPage },
      { title: 'Invoices', component: ListPage },
      { title: 'Shopping', component: ListPage },
      { title: 'Reports', component: ListPage },
      { title: 'Support', component: ListPage },
      { title: 'About', component: ListPage }
    ];

    pages.forEach(page => {
      this.translateService.get(page.title)
        .subscribe((res:string) => this.pages.push({title: res, component: page.component}),
          error => this.pages.push({title: page.title, component: page.component}))
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
