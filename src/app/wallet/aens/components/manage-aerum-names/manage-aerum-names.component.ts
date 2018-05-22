import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '@aerum/ui';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'; 
import { environment } from 'environments/environment';  
import Web3 from 'web3'; 
import { ManageAensContractComponent } from '@app/wallet/aens/components/manage-aens-contract/manage-aens-contract.component';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';  
import { BuyConfirmRequest } from '@app/wallet/aens/models/buyConfirmRequest';
import { BuyConfirmReponse } from '@app/wallet/aens/models/buyConfirmReponse';
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { AerumNameService } from '@app/core/aens/aerum-name-service/aerum-name.service';

@Component({
  selector: 'app-manage-aerum-names',
  templateUrl: './manage-aerum-names.component.html',
  styleUrls: ['./manage-aerum-names.component.scss']
})
export class ManageAerumNamesComponent implements OnInit {

  @ViewChild('manageContractComponent') manageContractComponent: ManageAensContractComponent;

  name: string;
  nameToBuy: string;
  account: string;

  price: number;
  nameFound: boolean;
  nameAvailable: boolean;
  processing: boolean;

  isOwner: boolean;

  checkForm: FormGroup;
  buyForm: FormGroup;

  web3: Web3;

  constructor(
    private authService: AuthenticationService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private aensService: AerumNameService
  ) 
  { }

  async ngOnInit() {
    const keystore = this.authService.getKeystore();
    this.account  = "0x" + keystore.address;

    this.web3 = this.authService.initWeb3();
    this.name = 'asrcrypto';

    this.checkForm = this.formBuilder.group({
      name: [null, [Validators.pattern("^[a-zA-Z0-9-]{5,50}$")]],
    });

    this.buyForm = this.formBuilder.group({
      name: [null, [Validators.pattern("^[a-zA-Z0-9-]{5,50}$")]],
      account: [null, [Validators.required, Validators.pattern("^(0x){1}[0-9a-fA-F]{40}$")]]
    });

    this.price = this.web3.utils.fromWei(await this.aensService.getPrice(), 'ether');
    this.isOwner = await this.aensService.isRegistrarOwner(this.account);

    // TODO: Test code. Just checking if resolve works. Remove later
    await this.aensService.resolveAddressFromName('sidlovskyy-test1.aer');
  }

  async checkName() {
    if(!this.canCheckName()) {
      console.log(`${this.name} is invalid name or other thing in proggress`);
      return;
    }

    try {
      this.startProcessing();
      await this.tryCheckName();
    } catch (e) {
      this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), `${this.translate('ENS.CHECK_NAME_ERROR')}: ${this.name}.aer`, 'aerum', 5000);
      throw e;
    }
    finally{
      this.stopProcessing();
    }
  }

  async tryCheckName() {
    const isAvailable = await this.aensService.isNameAvailable(this.name + ".aer");
    this.nameFound = true;
    this.nameAvailable = isAvailable;
    this.nameToBuy = this.name;
  }

  async buyName() {
    if(!this.canBuyName()) {
      console.log('Buy form is invalid or other thing in proggress');
      return;
    }

    try {
      this.startProcessing();
      await this.tryBuyName();
    } catch (e) {
      this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), `${this.translate('ENS.BUY_NAME_ERROR')}: ${this.nameToBuy}.aer`, 'aerum', 5000);
      throw e;
    }
    finally{
      this.stopProcessing();
    }
  }

  async tryBuyName() {
    const cost = await this.aensService.estimateBuyNameCost(this.nameToBuy, this.account, this.price.toString(10));
    console.log(`Buy name cost: ${cost}`);
    
    const buyRequest: BuyConfirmRequest = {
      name: this.nameToBuy.trim() + '.aer',
      amount: this.price,
      buyer: this.account,
      ansOwner: environment.contracts.aens.address.FixedPriceRegistrar,
      gasPrice: cost[0],
      estimatedFeeInGas: cost[1],
      maximumFeeInGas: cost[2] 
    };
    const modalResult: BuyConfirmReponse = await this.modalService.openBuyAensConfirm(buyRequest);
    if(!modalResult.accepted) {
      console.log('Name buy cancelled');
      return;
    }

    this.notificationService.notify(this.translate('ENS.OPERATION_STARTED_TITLE'), this.translate('ENS.OPERATION_IN_PROGRESS'), 'aerum', 3000);
    await this.aensService.buyName(this.nameToBuy, this.account, this.price.toString(10));
    this.notificationService.notify(this.translate('ENS.NAME_BUY_SUCCESS_TITLE'), `${this.translate('ENS.NAME_BUY_SUCCESS')}: ${this.nameToBuy}.aer`, 'aerum');

    if(this.manageContractComponent) {
      await this.manageContractComponent.refreshBalance();
    }
  }

  onNamePriceChanged(newPrice: number) {
    this.price =  this.web3.utils.fromWei(newPrice, 'ether');
  }

  hasError(control: FormControl) {
    if(!control) {
      return false;
    }

    return !control.valid && control.touched;
  }

  canCheckName() {
    return !this.processing && this.checkForm.valid;
  }

  canBuyName() {
    return !this.processing && this.buyForm.valid && this.nameAvailable;
  }

  private startProcessing() {
    this.processing = true;
  }

  private stopProcessing() {
    this.processing = false;
  }

  private translate(key: string) {
    return this.translateService.instant(key);
  }
}
