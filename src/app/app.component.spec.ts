import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService} from "@ngx-translate/core";
import { MyApp } from './app.component';
import {Observable} from "rxjs";
import {DBProvider} from "../services/db.provider";

describe('MyApp', () => {
  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy,
  translateSpy,translateLngSpy, getSpy, dbProviderSpy;

  beforeEach(async(() => {
    statusBarSpy = { styleDefault: jest.fn() };
    splashScreenSpy = { hide: jest.fn() };
    platformReadySpy = jest.fn().mockImplementation(() => Promise.resolve());
    platformSpy = {
      ready: platformReadySpy
    };

    translateLngSpy = jest.fn().mockImplementation((str) => str);
    getSpy = jest.fn().mockImplementation((str) => Observable.create(observer => observer.next(str)));

    translateSpy = {
      setDefaultLang: translateLngSpy,
      get: getSpy
    };

    dbProviderSpy = {};

    TestBed.configureTestingModule({
      declarations: [MyApp],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: TranslateService, useValue: translateSpy},
        { provide: DBProvider, useValue: dbProviderSpy}
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(MyApp);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(MyApp);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy();
    expect(statusBarSpy.styleDefault).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  it('should translate 10 items', () => {
    TestBed.createComponent(MyApp);
    expect(translateSpy.get).toBeCalledTimes(10);
  });
});
