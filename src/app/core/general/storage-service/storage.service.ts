import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { SessionStorageService } from 'ngx-webstorage';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { environment } from '@env/environment';

@Injectable()
export class StorageService {

  constructor(private sessionStorageService: SessionStorageService) { }

  Observe(raw: string): EventEmitter<any> {
    return this.sessionStorageService.observe(raw);
  }

  /**
   * Sets the cookie with the specified attributes.
   * @param {string} name The name of the cookie.
   * @param {*} data Data to store inside the cookie.
   * @param {boolean} [encrypt=false] Specifies whether the cookie should be encrypted (false by default)
   * @param {number} [expirationTime=undefined] Specifies the expiration time (infinite by default)
   * @memberof StorageService
   */
  setCookie(name: string, data, encrypt = false, expirationTime: number = undefined) {
    const dataToStore = encrypt ? CryptoJS.AES.encrypt(data, this.getSessionData('password')) : data;
    const isMobileBuild = environment.isMobileBuild;
    if(isMobileBuild) {
      Cookie.set(name, dataToStore, expirationTime);
    }else {
      Cookie.set(name, dataToStore, expirationTime, '/', environment.cookiesDomain);
    }
  }

  /**
   * Returns the data from the cookie with specified name.
   * @param {string} name Name of the cookie
   * @param {boolean} [decrypt=false] Determines whether the cookie should be decrypted (false by default);
   * @returns {*}
   * @memberof StorageService
   */
  getCookie(name: string, decrypt = false): string {
    let data = Cookie.get(name);
    if (decrypt && data) {
      data = CryptoJS.AES.decrypt(Cookie.get(name), this.getSessionData('password')).toString(CryptoJS.enc.Utf8);
    }
    return data;
  }

  /**
   * Retreives data from the current session storage.
   * @param {string} key Key of the entry in the session storage.
   * @returns {*}
   * @memberof StorageService
   */
  getSessionData(key: string): any {
    return this.sessionStorageService.retrieve(key);
  }

  /**
   * Sets the data into the session storage with the key specified.
   * @param {string} key Key of the entry in the session storage.
   * @param {*} data Data to store.
   * @memberof StorageService
   */
  setSessionData(key: string, data) {
    this.sessionStorageService.store(key, data);
  }

  /**
   * Clear data from session storage by specified key
   * @param {string} key Key of the entry in the session storage
   * @memberof StorageService
   */
  clearSessionData(key: string) {
    this.sessionStorageService.clear(key);
  }
}
