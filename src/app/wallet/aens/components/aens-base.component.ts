import { AbstractControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import {EventEmitter, Output} from "@angular/core";

export abstract class AensBaseComponent {

  locked: boolean;
  @Output() processing: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected constructor(private translateService: TranslateService) { }

  hasError(control: AbstractControl): boolean {
    if(!control) {
      return false;
    }

    return !control.valid && control.touched;
  }

  lock(): void {
    this.locked = true;
  }

  unlock(): void{
    this.locked = false;
  }

  protected startProcessing(): void {
    this.processing.emit(true);
  }

  protected stopProcessing(): void {
    this.processing.emit(false);
  }

  protected multiContractsExecutionNotificationTitle(current: number, total: number) {
    return `${this.translate('ENS.EXECUTING_CONTRACT')} ${current} ${this.translate('ENS.N_OF')} ${total}`;
  }

  protected translate(key: string): string {
    return this.translateService.instant(key);
  }
}
