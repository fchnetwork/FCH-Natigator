import { Injectable } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";
import { Inject } from "@angular/core";
import { EnvironmentService } from "@core/general/environment-service/environment.service";

declare const window: any;

@Injectable()
export class ClipboardService {
  private dom: Document;
  private isMobileBuild: boolean;

  constructor(
    @Inject(DOCUMENT) dom: Document,
    private environment: EnvironmentService) {
    this.dom = dom;
    this.isMobileBuild = this.environment.get().isMobileBuild;
  }

  copy(value: string): Promise<string> {
    if (this.isMobileBuild) {
      return this.copyMobile(value);
    }
    return this.copyWeb(value);
  }

  copyWeb(value: string): Promise<string> {
    const promise = new Promise<string>(
      (resolve, reject): void => {
        let textarea = null;

        try {
          textarea = this.dom.createElement("textarea");
          textarea.style.height = "0px";
          textarea.style.left = "-100px";
          textarea.style.opacity = "0";
          textarea.style.position = "fixed";
          textarea.style.top = "-100px";
          textarea.style.width = "0px";
          this.dom.body.appendChild(textarea);

          textarea.value = value;
          textarea.select();

          this.dom.execCommand("copy");

          resolve(value);
        } finally {
          if (textarea && textarea.parentNode) {
            textarea.parentNode.removeChild(textarea);
          }
        }
      }
    );
    return promise;
  }

  copyMobile(value: string): Promise<string> {
    const promise = new Promise<string>(
      (resolve, reject): void => {
        if(window.cordova && window.cordova.plugins && window.cordova.plugins.clipboard) {
          window.cordova.plugins.clipboard.copy(value, () => {
            resolve(value);
          }, err => {
            reject(err);
          });
        } else {
          reject('Clipboard plugin not defined');
        }
      });

    return promise;
  }
}
