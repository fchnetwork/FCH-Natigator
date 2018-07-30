import { Injectable } from '@angular/core';
declare const window: any;

@Injectable()
export class GlobalEventService {
  private windowLoaded: Promise<boolean>;

  constructor() {
  }

  isWindowLoaded(): Promise<boolean> {
    return this.windowLoaded;
  }

  init() {
    this.windowLoaded = this.initWindowLoaded();
  }

  private initWindowLoaded(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      window.addEventListener('load', () => {
        resolve(true);
      });
    });
  }
}
