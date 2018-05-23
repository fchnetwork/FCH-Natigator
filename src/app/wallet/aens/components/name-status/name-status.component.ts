import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { CheckStatus } from "@core/aens/aerum-name-service/check-status.enum";

@Component({
  selector: 'app-name-status',
  templateUrl: './name-status.component.html',
  styleUrls: ['./name-status.component.scss']
})
export class NameStatusComponent implements OnChanges {

  @Input() name: string;
  @Input() status: CheckStatus = CheckStatus.None;
  statusDescription: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.updateStatusDescription();
  }

  updateStatusDescription() {
    switch (this.status) {
      case CheckStatus.Available: { this.statusDescription = 'ENS.AVAILABLE'; break; }
      case CheckStatus.NotAvailable: { this.statusDescription = 'ENS.NOT_AVAILABLE'; break; }
      case CheckStatus.Owner: { this.statusDescription = 'ENS.OWNER'; break; }
      default: { }
    }
  }
}
