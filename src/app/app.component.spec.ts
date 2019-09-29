import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component'
import {PlatformMock, StatusBarMock,
  SplashScreenMock, TranslateServiceMock} from "../../test-config/mocks-ionic";
import {TranslateService} from "@ngx-translate/core";

describe('MyApp Component', () => {
  let fixture: ComponentFixture<MyApp>;
  let component: MyApp;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp],
      imports: [
        IonicModule.forRoot(MyApp)
      ],
      providers: [
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: TranslateService, useClass: TranslateServiceMock}
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof MyApp).toBe(true);
  });

});
