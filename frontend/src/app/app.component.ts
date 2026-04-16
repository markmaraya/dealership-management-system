import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RichAnnApp';
  date: Date = new Date();
  now: String;
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: true,
    timeZone: 'Asia/Manila'
  };

  constructor() {
    setInterval(() => {
      this.date = new Date();
      this.now = new Intl.DateTimeFormat('en-US', this.options).format(this.date);
    }, 1);   
  }  
}
