import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';

@Injectable()
export class HostService {
  static BASE_URL: string = 'http://nydevsol10:5000';

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

}
