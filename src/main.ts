import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare const window;

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
};

if (typeof window['cordova'] !== 'undefined') {
  document.addEventListener('deviceready', () => {
    if(window.wkWebView) {
      window.wkWebView.injectCookie('/');
    }
    bootstrap();
  }, false);
} else {
  bootstrap();
}
