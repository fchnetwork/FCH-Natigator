import { Component, OnInit } from '@angular/core';
import { ModalService } from '@app/shared/services/modal.service';

@Component({
  selector: 'app-load-swap',
  templateUrl: './load-swap.component.html',
  styleUrls: ['./load-swap.component.scss']
})
export class LoadSwapComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit() {
  }

  loadSwap() {
    this.modalService.openLoadCreateConfirm();
  }

}
