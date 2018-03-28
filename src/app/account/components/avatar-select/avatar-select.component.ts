import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR,  } from '@angular/forms';

import { avatars } from '../../../shared/helpers/data.mock' 

import { AuthenticationService } from '../../services/authentication-service/authentication.service';


@Component({
  selector: 'app-avatar-select',
  templateUrl: './avatar-select.component.html',
  styleUrls: ['./avatar-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AvatarSelectComponent),
      multi: true
    }
  ]  
})
export class AvatarSelectComponent implements ControlValueAccessor, OnInit {
  
  @Input() label = 'switch';
  @Input('value') _value: number = 0;
  
  
  activeAvatar: number = 0;
  
  onChange: any = () => { };
  onTouched: any = () => { };
  avatars: any = avatars;
  

  get value(): any {
    return this._value;
  }

  set value(val) { 
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  constructor( public authServ: AuthenticationService) { }


  ngOnInit() {
    this.avatars = this.authServ.avatarsGenerator()

    this._value = this.avatars[0]

  // console.log("values "+  this.avatars[0])
    // console.log( JSON.stringify( this.avatars) )
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  switch(a) {
   // console.log(a)
   this.activeAvatar = a.id;
    this.value = a;
  }
}
