import { DialogRef } from 'ngx-modialog';
import { BasicModalContext } from '@shared/components/modals/basic-modal/basic-modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalComponent } from 'ngx-modialog';
import { Component, OnInit } from '@angular/core';
import { TokenService } from '@app/dashboard/services/token.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-add-token',
  templateUrl: './add-token.component.html',
  styleUrls: ['./add-token.component.scss']
})
export class AddTokenComponent implements ModalComponent<BasicModalContext>, OnInit {
  addTokenForm: FormGroup = this.formBuilder.group({});
  tokenAddress: any;
  tokenSymbol: any;
  decimals: any;
  totalSupply: any;

  constructor(
    public dialog: DialogRef<BasicModalContext>,
    public formBuilder: FormBuilder,
    private tokenService: TokenService,
    private sessionStorage: SessionStorageService,
  ) { }

  ngOnInit() {
    this.addTokenForm = this.formBuilder.group({
      // password: [ null, [Validators.required, Validators.minLength(10), PasswordValidator.number, PasswordValidator.upper, PasswordValidator.lower]],
      tokenAddress: [ null, [Validators.required, Validators.minLength(5)]],
      tokenSymbol: [ null, [Validators.required, Validators.minLength(2)]],
      decimals: [ null, [Validators.required]]
    });
    this.getTokenInfo(this.addTokenForm.value.tokenAddress);

    this.addTokenForm.controls['tokenAddress'].valueChanges.subscribe( (res) => {
      this.getTokenInfo(res);
    });

  }

  validateTokens() {
    const tokens = this.sessionStorage.retrieve('tokens');
    if(tokens) {
      // TODO: handle errors in any styled component
      for(let i = 0; i < tokens.length; i++) {
        if(this.totalSupply <= 0 || !Number.isInteger(this.totalSupply)) {
          alert('Tokens supply has to be bigger than 0');
          return false;
        } else if(this.addTokenForm.value.tokenSymbol === tokens[i].symbol){
          alert('You cannot add token with the same token name');
          return false;
        } else if (this.addTokenForm.value.tokenAddress === tokens[i].address) {
          alert('You cannot add token with the same token address');
          return false;
        }
      }
    } else {
      return true;
    }
    return true;
  }

  onSubmit() {
    const validate = this.validateTokens();
    // const validate = true;
    if (this.addTokenForm.valid && validate) {
      const token = {
        address: this.addTokenForm.value.tokenAddress,
        symbol: this.addTokenForm.value.tokenSymbol,
        decimals: this.addTokenForm.value.decimals
      };
      this.tokenService.addToken(token);
      this.dialog.dismiss();
    };
  }

  getTokenInfo(address) {
    // const address = "0x8414d0b6205d82100f694be759e40a16e31e8d40";
    const tokensInfo = this.tokenService.getTokensInfo(address).then((res:any)=>{
      this.tokenSymbol = res.symbol;
      this.decimals = res.decimals;
      this.totalSupply = Number(res.totalSupply) || 0;
    }).catch((err)=>{
      console.log(err);
    });
  }

}
