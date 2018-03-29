import { Component, OnDestroy, OnInit, OnChanges, ChangeDetectionStrategy, ViewContainerRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PasswordValidator } from '../../shared/helpers/validator.password';
import { testAccount } from '../../shared/helpers/data.mock';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AvatarSelectComponent } from '../components/avatar-select/avatar-select.component';
import { MatDialog } from '@angular/material';
import { RegistrationDialog } from './registration.dialog'
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { selectedSeedPhrase } from '../../shared/app.interfaces'
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';  
import { Subject } from 'rxjs/Subject'
import { TranslateService } from '@ngx-translate/core';

@Component({ 
// changeDetection: ChangeDetectionStrategy.OnPush,
selector: 'app-registration',
templateUrl: './registration.component.html',
styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnChanges {

  componentDestroyed$: Subject<boolean> = new Subject()
	activeAvatar: number = 1; // default activeAvatar selected
	form: FormGroup; 
	step: string = 'step_1';  // default page to show
	testAccount: any = testAccount;
	seed: Array<any> = [];
	cloneSeedArray: Array<any> = [];
	items: selectedSeedPhrase[];
	selectedItems: selectedSeedPhrase[];
	AerAddressData: any; // data returned from the API
	seedsMatchNotification: string;
	isEqual: boolean = false; // checks the seed array and the randomised one to see if the user clicked the right order

	payload: any = { // payload to send to the api - this is just a skeleton 
		avatar: 1,
		password: "",
		mnemonic: "", 
		address: "",
		extendedPrivateKey: "",
		extendedPublicKey: "",	
		private: "",
		public: "",			
	}         
	
	
	constructor( public toastr: ToastsManager, 
				 public vcr: ViewContainerRef,
				 public translate: TranslateService, 
				 public authServ: AuthenticationService,
				 public formBuilder: FormBuilder,
				 private router: Router,
				 public dialog: MatDialog ) {
				 this.toastr.setRootViewContainerRef(vcr);
				}

  // Opens a modal with information about the users seed - when closed it executes openBackupSeed() which forwards to the next step
	openDialog(): void {
		let dialogRef = this.dialog.open( RegistrationDialog, {
			width: '540px',
			panelClass:"o-modal-panel",
			backdropClass: "backdrop",
		});
		dialogRef.afterClosed().takeUntil( this.componentDestroyed$ ).subscribe(result => {
			if( result ){
				this.openBackupSeed()
			}
		});
	}

  //  When executed forwards to the next step 
	openBackupSeed(){
		this.step = "step_3"
	}

  //  If the Password form has a valid password it sets the payload with the selected password,  user avatar and Mneumonic seed generated ready to post to the auth API    
	onSubmit() {
		if (this.form.valid) {

			this.payload = {
				avatar: this.form.value.avatar.avatar,
				password: this.form.value.password,
				mnemonic: this.form.value.avatar.seed, 
				address: this.form.value.avatar.address,
				extendedPrivateKey: this.form.value.avatar.privExtend,
				extendedPublicKey: this.form.value.avatar.pubExtend,		
				private: this.form.value.avatar.private,
				public: this.form.value.avatar.public,								
			}

		this.seed = this.payload.mnemonic.split(" ")

		console.log( this.payload.mnemonic )
		
	this.newSeedConfirm();
			this.step = "step_2"
		}
	}

  //  Opens the Seed Information Dialog above    
	proceedStep3(){
		this.openDialog()
	}

  //  When executed forwards to the next step    
	proceedStep4() {
		this.step = "step_4"
	}    

	
	// user has ccreated an account, now encrypt the private key and save to a cookie for use on the transactions page
	authenticateUser() { 
		this.authServ.saveKeyStore( this.payload.private, this.payload.password )		
  	this.router.navigate(['/transaction']);
	}


   // Creates a randomized version of the Seed Phrase so that the user has to select it in the right order
	newSeedConfirm() {
		this.items = this.shuffleArray( this.seed.slice() ).map(x => ({ name: x, selected: false }));
		this.selectedItems = [];
	}

  //  Generates a new BIP39 Mneumonic Seed and maps it to an array, Executes newSeedConfirm to create a random seed builds the form using Angular Reactive forms module  
	ngOnInit() {
		this.form = this.formBuilder.group({});  
		this._buildForm();  
	}

  //  User Generates a new Array by selecting the Seed in the correct order - it compares the result using compareResult() method    
	select(item: selectedSeedPhrase) {
		if (item.selected) {
			return;
		}
		this.selectedItems.push(item);
		item.selected = true;
		if (this.selectedItems.length === this.seed.length) {
			this.compareResult();
		}
	}

  // Unselect an item in the selected array puzzle 
	unSelect(item: selectedSeedPhrase, idx: number) {
		item.selected = false;
		this.selectedItems.splice(idx, 1);
	}

  //  Compare the order of the user selected seed with the actual seed in the array puzzle
	compareResult() {
		if (this.selectedItems.map(x => x.name).toString() === this.seed.toString()) {
			this.isEqual = true;
			// console.log('They are in the same order')
		} else {
			this.isEqual = false;
			// console.log('They have different order')
		}
	}

  //  Copy seed to clipboard/      
	copyToClipboard() {
		this.showSuccess()
	}  

  //  Build the password/avatar form and enable Validators    
	_buildForm() {             
		this.form = this.formBuilder.group({
			password: [ this.testAccount[0]["password"], [Validators.required, Validators.minLength(10), PasswordValidator.number, PasswordValidator.upper, PasswordValidator.lower ] ],
			confirmpassword: [this.testAccount[0]["passwordConfirm"], [Validators.required ] ],
			avatar: [1]
		},{ 
			validator: this.matchingPasswords('password', 'confirmpassword')
		});
	}   

  // Custom validator to make sure the password and confirm password match /    
	matchingPasswords( passwordKey: string, passwordConfirmationKey: string ) {
		return (group: FormGroup ) => {
			let passwordInput = group.controls[passwordKey];
			let passwordConfirmationInput = group.controls[passwordConfirmationKey];
			if (passwordInput.value !== passwordConfirmationInput.value ) {
				return passwordConfirmationInput.setErrors({notEquivalent: true})
			}
		}
	}

  // Shuffle the seed to the seed user puzzle
	shuffleArray(arr) {
		for (let c = arr.length - 1; c > 0; c--) {
			let b = Math.floor(Math.random() * (c + 1));
			let a = arr[c];
			arr[c] = arr[b];
			arr[b] = a;
		}
		return arr;
	}

  // Copy to clipboard directive error log
	public logError( error: Error ) : void {
		this.showError();
		console.group( "Clipboard Error" );
		console.error( error );
		console.groupEnd();
	}

  // Copy to clipboard directive success message - executes	showSuccess()
	public logSuccess( value: string ) : void {
		this.showSuccess()
		console.group( "Clipboard Success" );
		console.log( value );
		console.groupEnd();
	}

  //  Issues with angular change detection strategy - will come back to this
	public ngOnChanges(): void {
		console.info("user-view-push changed");
	} 

  //  Copy to clipboard success toaster message   
	showSuccess() {
		this.toastr.success('Seed phrase copied to clipboard', 'Success!');
	}

  // Copy to clipboard error toaster message    
	showError() {
		this.toastr.error('There was a problem copying seed phrase', 'Oops!');
	}

	ngOnDestroy() {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}


	goToLogin() {
    this.router.navigate(['/login']);
  }


}

