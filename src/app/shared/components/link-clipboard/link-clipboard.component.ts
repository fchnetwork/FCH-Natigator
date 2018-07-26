import { Component, OnInit, Input } from '@angular/core';
import { ClipboardService } from '@app/core/general/clipboard-service/clipboard.service';
import { NotificationMessagesService } from '@app/core/general/notification-messages-service/notification-messages.service';

@Component({
  selector: 'app-link-clipboard',
  templateUrl: './link-clipboard.component.html',
  styleUrls: ['./link-clipboard.component.scss']
})
export class LinkClipboardComponent implements OnInit {

  @Input() link: string;

  constructor(public clipboardService: ClipboardService,
    public notificationMessagesService: NotificationMessagesService) { }

ngOnInit() {
}

copyToClipboard() {
this.clipboardService.copy(`${this.link}`);
this.notificationMessagesService.valueCopiedToClipboard();
}
}
