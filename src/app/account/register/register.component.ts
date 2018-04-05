import { Component, OnInit } from '@angular/core'; 
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup; 
  password: string;
  confirmPassword: string;
  avatar: string;
  
  constructor(public translate: TranslateService, public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({});
  } 
}
