import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-return-url-handler',
  templateUrl: './return-url-handler.component.html',
  styleUrls: ['./return-url-handler.component.scss']
})
export class ReturnUrlHandlerComponent implements OnInit {
  returnUrl: string;

  constructor(public route : ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  getReturnUrlLink(url: string) {
    return this.router.createUrlTree([url], this.returnUrl === "/" ? {} : {queryParams: {returnUrl: this.returnUrl}}).toString();
  }

}
