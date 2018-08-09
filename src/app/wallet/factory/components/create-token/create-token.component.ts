import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { NotificationService } from "@aerum/ui";
import { CreateTokenModel } from "@app/core/factory/models/create-token.model";
import { ModalService } from "@core/general/modal-service/modal.service";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { TokenFactoryService } from "@core/factory/token-factory-service/token-factory.service";

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

  constructor(
    private logger: LoggerService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private tokenFactoryService: TokenFactoryService
  ) { }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(100), Validators.pattern("^[0-9A-Za-z- ]+$")]],
      symbol: [null, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9A-Z]+$")]],
      supply: [null, [Validators.required, Validators.pattern("^[0-9]{1,10}$"),  Validators.min(1)]],
      decimals: [null, [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0), Validators.max(18)]]
    });
  }

  async createToken() {
    if(!this.canCreateToken()) {
      this.logger.logMessage("Cannot create token due to validation issues");
      return;
    }

    try {
      this.locked = true;
      await this.tryCreateToken(this.createForm.value as CreateTokenModel);
    } catch (e) {
      // TODO: Add notification
      this.logger.logError('Create token error:', e);
    } finally {
      this.locked = false;
    }
  }

  private async tryCreateToken(data: CreateTokenModel) {
    await this.tokenFactoryService.create(data);
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
