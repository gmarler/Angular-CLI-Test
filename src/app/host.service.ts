import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';
import {environment} from "../environments/environment";

@Injectable()
export class HostService {
  private envName;

  // Based on whether we are in dev or prod environment, make the SVC_HOST and SVC_PORT configurable
  private SVC_HOST: string = 'nydevsol10';
  private SVC_PORT: string;
  private BASE_URL: string;

  constructor(private http: Http) {
    if (environment.production) {
      this.envName = "production";
      this.SVC_PORT = '80';
      this.BASE_URL = `http://${this.SVC_HOST}:${this.SVC_PORT}`;
    } else {
      this.envName = "dev";
      this.SVC_PORT = '5000';
      this.BASE_URL = `http://${this.SVC_HOST}:${this.SVC_PORT}`;
    }
    console.log(`ENVIRONMENT: ${this.envName}`);
    console.log(`BASE_URL: ${this.BASE_URL}`);
  }

  query(URL: string, params?: Array<string>): Observable<any[]> {
    let queryURL: string = `${this.BASE_URL}${URL}`;

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
