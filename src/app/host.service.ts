import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';

@Injectable()
export class HostService {
  // TODO: Based on whether we are in dev or prod environment, make the SVC_HOST and SVC_PORT configurable
  static SVC_HOST: string = 'nydevsol10';
  static SVC_PORT: string = '5000';
  static BASE_URL: string = `http://${HostService.SVC_HOST}:${HostService.SVC_PORT}`;

  constructor(private http: Http) {
  }

  query(URL: string, params?: Array<string>): Observable<any[]> {
    let queryURL: string = `${HostService.BASE_URL}${URL}`;

    // TODO: Add params handling
    // if (params) {
    //   queryURL = `${queryURL}?${params.join('&')}`;
    // }

    return this.http.request(queryURL).map((res: any) => res.json());
  }

  getHosts(): Observable<any[]> {
    return this.query(`/hosts`);
  }

  // TODO: Create a getMetric that takes as arguments:
  // host: string
  // date: string
  // subsystem: string
  // metric: string
  // which then calls /host/<host>/date/<date>/subsystem/<subsystem>/metric/<metric>

}
