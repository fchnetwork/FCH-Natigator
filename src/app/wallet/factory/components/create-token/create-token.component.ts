import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-create-token',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.scss']
})
export class CreateTokenComponent implements OnInit {

  locked = false;

  name: string;
  symbol: string;
  supply: number;
  decimals: number;
  address: string;

  createForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(100), Validators.pattern("^[0-9A-Za-z- ]+$")]],
      symbol: [null, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9A-Z]+$")]],
      supply: [null, [Validators.required, Validators.pattern("^[0-9]{1,10}$"),  Validators.min(1)]],
      decimals: [null, [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0), Validators.max(18)]]
    });
  }

  async createToken() {
    this.address = "abc";
  }

  canCreateToken() {
    return !this.locked && this.createForm.valid;
  }

  hasError(control: AbstractControl): boolean {
    if(!control) {
      return false;
    }

    return !control.valid && control.touched;
  }
}
