import { Injectable } from '@angular/core';
import { Overlay } from 'ngx-modialog';
import { BasicModalComponent } from '../../components/basic-modal/basic-modal.component';
import { Modal, DialogRef, overlayConfigFactory, OverlayConfig, ModalComponent, ContainerContent } from "ngx-modialog";
import { BSModalContext } from 'ngx-modialog/plugins/bootstrap';

@Injectable()
export class ModalService {

    constructor(private modal: Modal) {      
    }

    private openModal(modal: ContainerContent, config: any = {}) : Promise<DialogRef<any>> {
        let overlayConfig = overlayConfigFactory(config, BSModalContext);
        return this.modal.open(modal, overlayConfig).result.then((modal) => {
          return modal.result;
        }, (err) => {
          return new Promise((resolve, reject) => {return reject(err)});
        });
      }

    public openBasicModal(data?: any): Promise<any> { 
        return this.openModal(BasicModalComponent, {isBlocking: false, dialogClass: 'adaptive-dialog', param: data});
    }
}