/* tslint:disable:no-unused-variable */

import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';
import {Http, ConnectionBackend, BaseRequestOptions} from '@angular/http';
import { HostService } from './host.service';

describe('HostService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HostService,
        MockBackend,
        BaseRequestOptions,
        { provide: Http,
          useFactory: (backend: ConnectionBackend,
                       defaultOptions: BaseRequestOptions) => {
                         return new Http(backend, defaultOptions);
                       },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should ...', inject([HostService], (service: HostService) => {
    expect(service).toBeTruthy();
  }));
});
