import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import 'rxjs/Rx';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { environment } from '@env/environment';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';


@Injectable()
export class ExplorerService {

  web3: any;
  account: any;
  txpoolContentData = { "jsonrpc": "2.0", "method": "txpool_content", "params": [], "id": 1 };

  constructor(private _http: Http, _auth: AuthenticationService) {
    this.web3 = _auth.initWeb3();
    this.account = JSON.parse(Cookie.get('account'));
  }

  fromWei(amountInWei, currency) {
    return this.web3.utils.fromWei(amountInWei.toString(), currency);
  }

  getPendingTransactions() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http
      .post(environment.HttpProvider, this.txpoolContentData, options)
      .map(response => response.json().result.pending);
  }

  getBlock(): Observable<any> {
    return Observable.create(observer => {
      this.web3.eth.getBlockNumber((err, block) => {

        if (err != null) {
          observer.error('There was an error fetching your blocks.');
          observer.complete();
        }
        if (block.length === 0) {
          observer.error('no blocks');
          observer.complete();
        }

        return observer.next(block);
      });
    });
  }
}
