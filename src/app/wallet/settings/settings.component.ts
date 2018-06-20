import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router : Router) {
    // route.queryParams.subscribe(
    //   params => console.log('queryParams', params));
   }

  ngOnInit() {
    
  }

}
