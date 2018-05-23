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
    this.loaderService.loaderShown$.subscribe(shown => {
      this.loaderShown = shown; 
    }, (err) => console.log(err));
  }

  ngOnInit() {
    
  } 
}
