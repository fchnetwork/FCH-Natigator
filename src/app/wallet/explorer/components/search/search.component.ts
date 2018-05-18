import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';    
import { FormBuilder, FormGroup, Validators, FormArray, FormControl,AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {

  form: FormGroup;

  constructor( 
        private _ngZone: NgZone,
        private cd: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router,
        public formBuilder: FormBuilder ) { }


  ngOnInit() {
    const nameRegex = /^([a-zA-Z0-9_-]+)$/;
    const args = [ Validators.required, this.noWhiteSpace, Validators.pattern(nameRegex),Validators.minLength(1), Validators.maxLength(66)];
      this.form = this.formBuilder.group({
        searchAerum: ["", Validators.compose( args )],
      });
  }



  noWhiteSpace(control: AbstractControl) {
    if ( /\s/g.test(control.value)   ) {
      return { whitespace: true };
    }
    return null;
  }



  search() {

    let item = this.form.value.searchAerum;

    if( /[a-z]/i.test(item)  ) {

       item = item.split('0x').join('');

       if ( item.length == 40 ) {
        this.inspectAddress( "0x"+item );
       } else if( item.length == 64 && /[0-9a-zA-Z]{64}?/.test(item) ) {
        this.inspectTransaction( "0x"+item );
       } else {
        alert(`Error: ${item} is not a valid Block, Address or Transaction`);
       }

    } else if ( /[0-9]{1,7}?/.test(item)) {
      this.inspectBlock( parseInt(item)  );
    } 

  }  

  goHome(){
    this.router.navigate(['/explorer'], { relativeTo: this.route });
  }

  inspectBlock( blockNumber: number ) {
    this.router.navigate(['/explorer/block', blockNumber ], { relativeTo: this.route });
  } 

  inspectAddress( address: string ){
    this.router.navigate(['/explorer/address', address ], { relativeTo: this.route });
  }

  inspectTransaction( transaction: string ){
      this.router.navigate(['/explorer/transaction', transaction ], { relativeTo: this.route });
  }

}
