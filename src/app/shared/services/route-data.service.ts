import { Injectable } from '@angular/core';

@Injectable()
export class RouteDataService<T> {
    routeData: T; 

    public clear() {
        this.routeData = null;
    }

    public hasData() : boolean {
        return this.routeData != null && this.routeData != undefined;
    }

    constructor() { }
}
