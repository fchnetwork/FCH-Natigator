/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExplorerService } from './explorer.service';

describe('Service: Explorer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExplorerService]
    });
  });

  it('should ...', inject([ExplorerService], (service: ExplorerService) => {
    expect(service).toBeTruthy();
  }));
});