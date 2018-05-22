/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ModalService } from './modal.service';
import { Modal } from "ngx-modialog";

describe('Service: Modal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ModalService,
        { provide: Modal, useValue: jest.fn() }
      ]
    });
  });

  it('should ...', inject([ModalService], (service: ModalService) => {
    expect(service).toBeTruthy();
  }));
});
