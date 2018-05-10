import { Injectable } from '@angular/core';

@Injectable()
export class RouteDataService<T> {
    routeData: T; 

    clear() {
        this.routeData = null;
    }

    hasData() : boolean {
        return this.routeData != null && this.routeData != undefined;
    }

    constructor() { }
}
