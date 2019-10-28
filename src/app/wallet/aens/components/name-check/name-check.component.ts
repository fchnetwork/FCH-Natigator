import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { NotificationService } from '@aerum/ui';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NameCheckedEvent } from "@aens/models/nameCheckedEvent";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { AerumNameService } from '@core/aens/aerum-name-service/aerum-name.service';
import { AensBaseComponent } from "@aens/components/aens-base.component";

@Component({
  selector: 'app-name-check',
  templateUrl: './name-check.component.html',
  styleUrls: ['./name-check.component.scss']
})
export class NameCheckComponent extends AensBaseComponent implements OnInit {

  @Output() nameChecked: EventEmitter<NameCheckedEvent> = new EventEmitter<NameCheckedEvent>();

  @Input() account: string;
  @Input() name: string;

  checkForm: FormGroup;

  constructor(
    translateService: TranslateService,
    private logger: LoggerService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private aensService: AerumNameService
  ) { super(translateService); }

  ngOnInit() {
    this.checkForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern("^[a-zA-Z0-9-]{5,50}$")]],
    });
  }

  async checkName(name?: string) {
    const nameToCheck = (name || this.name).trim();

    if(!this.canCheckName()) {
      this.logger.logMessage(`${nameToCheck} is invalid name or other thing in progress`);
      return;
    }

    try {
      this.startProcessing();
      await this.tryCheckName(nameToCheck);
    } catch (e) {
      this.notificationService.notify(this.translate('ENS.UNHANDLED_ERROR'), `${this.translate('ENS.CHECK_NAME_ERROR')}: ${nameToCheck}.f`, 'aerum', 5000);
      this.logger.logError(`${nameToCheck} search error: `, e);
    }
    finally{
      this.stopProcessing();
    }
  }

  async tryCheckName(name: string) {
    const trimmedName = name.trim();
    const fullName = trimmedName + ".f";

    const status = await this.aensService.checkStatus(this.account, fullName);

    this.nameChecked.emit(new NameCheckedEvent(trimmedName, status));
  }

  canCheckName() {
    return !this.locked && this.checkForm.valid;
  }
}
