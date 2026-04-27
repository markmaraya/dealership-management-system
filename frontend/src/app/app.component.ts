import { Component } from '@angular/core';
import { appConfig } from '../config/appConfig';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = appConfig.APP_TITLE;
  logoPath = appConfig.LOGO_PATH;
}
