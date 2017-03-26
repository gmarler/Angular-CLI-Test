import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable, BehaviorSubject, Subject} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';


import {environment} from '../environments/environment';
import {Host} from './host';
// import any = jasmine.any;

let initialHostList: Array<Host> = [];
// TODO: This service should just be to provide the list of PA Server hosts

@Injectable()
export class HostService {
  private envName;
  private currentPAServer;
  private currentHost:     Subject<Host>   = new BehaviorSubject<Host>(null);
  private currentHostList: Subject<Host[]> = new BehaviorSubject<Host[]>(initialHostList);

  // Based on whether we are in dev or prod environment, make the SVC_HOST and SVC_PORT configurable
  private SVC_HOST:  string = 'nydevsol10.dev.bloomberg.com';
  private SVC_PORT:  string;
  private BASE_URL:  string;
  private HOSTS_URL: string = 'app/hosts';

  constructor(private http: Http) {
    if (environment.production) {
      this.envName = 'production';
      this.SVC_PORT = '80';
      this.BASE_URL = `http://${this.SVC_HOST}:${this.SVC_PORT}`;
    } else {
      this.envName = 'dev';
      this.SVC_PORT = '5000';
      this.BASE_URL = `http://${this.SVC_HOST}:${this.SVC_PORT}`;
    }
    console.log(`ENVIRONMENT: ${this.envName}`);
    console.log(`BASE_URL: ${this.BASE_URL}`);

    // TODO: Eventually use this to create BASE_URL
    this.currentPAServer = this.SVC_HOST;
  }

  private query(URL: string, params?: Array<string>): Observable<any[]> {
    let queryURL = `${this.BASE_URL}${URL}`;

    // TODO: Add params handling
    // if (params) {
    //   queryURL = `${queryURL}?${params.join('&')}`;
    // }

    return this.http.request(queryURL).map((res: any) => res.json());
  }

  // TODO: Should this be private instead?
  public getHosts(): Observable<Host[]> {
    return this.http.get(this.HOSTS_URL)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  private handleError(error: Response | any) {
    // TODO: Use another logging infrastructure
    let errMsg:  string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  public setCurrentHost(newHost: Host): void {
    this.currentHost.next(newHost);
  }

  public getCurrentHost(): Subject<Host> {
    return this.currentHost;
  }

  /*
   TODO: Create a getMetric that takes as arguments:
   host: string
   date: string
   subsystem: string
   metric: string
   which then calls /host/<host>/date/<date>/subsystem/<subsystem>/metric/<metric>
   */
}
