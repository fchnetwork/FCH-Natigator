import { Component, OnInit, Input } from '@angular/core';
import { ClipboardService } from '@app/core/general/clipboard-service/clipboard.service';
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';

@Component({
  selector: 'app-address-clipboard',
  templateUrl: './address-clipboard.component.html',
  styleUrls: ['./address-clipboard.component.scss']
})
export class AddressClipboardComponent implements OnInit {
  @Input() address: string;
  @Input() short: boolean = false;
  @Input() centered: boolean = false;
  @Input() icon: string = "clipboard";

  constructor(public clipboardService: ClipboardService,
              public notificationMessagesService: NotificationMessagesService) { }

  ngOnInit() {
  }

  copyToClipboard() {
    this.clipboardService.copy(`${this.address}`);
    this.notificationMessagesService.valueCopiedToClipboard();
  }

}
