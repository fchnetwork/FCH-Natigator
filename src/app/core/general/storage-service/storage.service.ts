import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { SessionStorageService } from 'ngx-webstorage';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { environment } from '@env/environment';

@Injectable()
export class StorageService {

    constructor(private sessionStorageService: SessionStorageService) { } 

    /**
     *Sets the cookie with the specified attributes.
     *
     * @param {string} name The name of the cookie. 
     * @param {*} data Data to store inside the cookie.
     * @param {boolean} [encrypt=false] Specifies whether the cookie should be encrypted (false by default)
     * @param {number} [expirationTime=undefined] Specifies the expiration time (infinite by default)
     * @memberof StorageService
     */
    setCookie(name: string, data: any, encrypt: boolean = false, expirationTime: number = undefined) {
        const dataToStore = encrypt ? CryptoJS.AES.encrypt(data, this.getSessionData('password')) : data;
        Cookie.set(name, dataToStore, expirationTime, "/", environment.cookiesDomain);
    }

    /**
     *Returns the data from the cookie with specified name.
     *
     * @param {string} name Name of the cookie
     * @param {boolean} [decrypt=false] Determines whether the cookie should be decrypted (false by default);
     * @returns {*}
     * @memberof StorageService
     */
    getCookie(name: string, decrypt: boolean = false): any { 
        let data = Cookie.get(name);

        if (decrypt && data && data != null) {
            data = CryptoJS.AES.decrypt(Cookie.get(name), this.getSessionData('password')).toString(CryptoJS.enc.Utf8);
        }

        return data;
    }

    /**
     *Retreives data from the current session storage.
     *
     * @param {string} key Key of the entry in the session storage. 
     * @returns {*}
     * @memberof StorageService
     */
    getSessionData(key: string): any {
        return this.sessionStorageService.retrieve(key);
    }

    /**
     *Sets the data into the session storage with the key specified.
     *
     * @param {string} key Key of the entry in the session storage.
     * @param {*} data Data to store. 
     * @memberof StorageService
     */
    setSessionData(key: string, data: any) {
        this.sessionStorageService.store(key, data);
    }
}
