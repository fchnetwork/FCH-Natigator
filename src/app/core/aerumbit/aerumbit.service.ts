import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/first';
import { environment } from '@env/environment';
import { RequestFaucetData, RequestFaucetTokenData } from './models/request-faucet-data';

@Injectable()
export class AerumbitService {

  constructor(private http: HttpClient) { }

  requestFaucetToken(address: string): Promise<RequestFaucetTokenData> {
    const url = `${environment.aerumBit}account/request-faucet-token/${address}`;
    return new Promise((resolve, reject) => {
      this.http.get(url)
        .first()
        .subscribe(data => {
          resolve(data as RequestFaucetTokenData);
        }, error => reject(error));
    });
  }

  requestFaucet(token: string): Promise<RequestFaucetData> {
    const url = `${environment.aerumBit}account/request-faucet`;
    return new Promise((resolve, reject) => {
      this.http.post(url, { token })
        .first()
        .subscribe(data => resolve(data as RequestFaucetData), error => reject(error));
    });
  }
}
