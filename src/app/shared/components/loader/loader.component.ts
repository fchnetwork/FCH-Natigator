import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { LoaderService } from '@app/core/general/loader-service/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  private loaderShown = false;

  constructor(public loaderService: LoaderService) {
    loaderService.loaderShown$.subscribe(shown => {
      this.loaderShown = shown;
      console.log('loader ' + shown);
    });
  }

  ngOnInit() {
  }

}
