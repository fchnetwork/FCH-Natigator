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
   * Stores data with the specified attributes.
   * @param {string} name The name of the data item.
   * @param {*} data Data to store inside the storage.
   * @param {boolean} [encrypt=false] Specifies whether the data should be encrypted (false by default)
   * @param {number} [expirationTime=undefined] Specifies the expiration time (infinite by default)
   * @memberof StorageService
   */
  setStorage(name: string, data, encrypt = false, expirationTime: number = undefined) {
    const isMobileBuild = environment.isMobileBuild;
    if(isMobileBuild) {
      this.setLocalStorage(name, data, encrypt);
    } else {
      this.setCookie(name, data, encrypt, expirationTime);
    }
  }

  /**
   * Returns the data from the storage with specified name.
   * @param {string} name Name of the data item
   * @param {boolean} [decrypt=false] Determines whether the data should be decrypted (false by default);
   * @returns {*}
   * @memberof StorageService
   */
  getStorage(name: string, decrypt = false): string {
    const isMobileBuild = environment.isMobileBuild;
    return isMobileBuild
      ? this.getLocalStorage(name, decrypt)
      : this.getCookie(name, decrypt);
  }


  /**
   * Sets the cookie with the specified attributes.
   * @param {string} name The name of the cookie.
   * @param {*} data Data to store inside the cookie.
   * @param {boolean} [encrypt=false] Specifies whether the cookie should be encrypted (false by default)
   * @param {number} [expirationTime=undefined] Specifies the expiration time (infinite by default)
   * @memberof StorageService
   */
  private setCookie(name: string, data, encrypt = false, expirationTime: number = undefined) {
    const dataToStore = encrypt ? CryptoJS.AES.encrypt(data, this.getSessionData('password')) : data;
    Cookie.set(name, dataToStore, expirationTime, '/', environment.cookiesDomain);
  }

  /**
   * Returns the data from the cookie with specified name.
   * @param {string} name Name of the cookie
   * @param {boolean} [decrypt=false] Determines whether the cookie should be decrypted (false by default);
   * @returns {*}
   * @memberof StorageService
   */
  private getCookie(name: string, decrypt = false): string {
    let data = Cookie.get(name);
    if (decrypt && data) {
      data = CryptoJS.AES.decrypt(Cookie.get(name), this.getSessionData('password')).toString(CryptoJS.enc.Utf8);
    }
    return data;
  }

  /**
   * Sets the local storage with the specified attributes.
   * @param {string} name The name of the item.
   * @param {*} data Data to store inside the local storage.
   * @param {boolean} [encrypt=false] Specifies whether the item should be encrypted (false by default)
   * @memberof StorageService
   */
  private setLocalStorage(name: string, data: string, encrypt = false) {
    const dataToStore = encrypt ? CryptoJS.AES.encrypt(data, this.getSessionData('password')) : data;
    localStorage.setItem(name, dataToStore);
  }

  /**
   * Returns the data from the local storage with specified name.
   * @param {string} name Name of the item
   * @param {boolean} [decrypt=false] Determines whether the item should be decrypted (false by default);
   * @returns {*}
   * @memberof StorageService
   */
  private getLocalStorage(name: string, decrypt = false): string {
    let data = localStorage.getItem(name);
    if (decrypt && data) {
      data = CryptoJS.AES.decrypt(localStorage.getItem(name), this.getSessionData('password')).toString(CryptoJS.enc.Utf8);
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
