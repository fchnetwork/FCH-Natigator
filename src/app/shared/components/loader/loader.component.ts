import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { LoaderService } from '@app/core/general/loader-service/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  message: any;
  loaderShown = false;

  constructor(public loaderService: LoaderService) {
    this.loaderService.loaderShown$.subscribe(result => {
      this.loaderShown = result.visible;
      this.message = result.message;
    }, (err) => console.log(err));
  }

  ngOnInit() {

  }
}
