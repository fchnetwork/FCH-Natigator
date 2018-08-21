import { environment } from '@env/environment';

declare const window: any;

export function isAndroidDevice(): boolean {
  if(environment.isMobileBuild) {
    return window.device && window.device.platform === 'Android';
  }
  return false;
}