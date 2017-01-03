/* tslint:disable:no-unused-variable */

import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';
import {Http, ConnectionBackend, BaseRequestOptions, ResponseOptions, Response} from '@angular/http';
import { HostService } from './host.service';

describe('HostService', () => {
  let svcHost: string = 'nydevsol10';
  let svcPort: number = 5000;

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

  it('...should exist', inject([HostService], (service: HostService) => {
    expect(service).toBeTruthy();
  }));

  // TODO: Test HostService.SVC_{HOST|PORT} based on whether we are in dev or prod mode

  // sets up an expectation that the correct URL will being requested
  function expectURL(backend: MockBackend, url: string) {
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe(url);
      let response = new ResponseOptions({body: '{"name": "felipe"}'});
      c.mockRespond(new Response(response));
    });
  }

  describe('getHosts', () => {
    it('Retrieves host list',
      inject([HostService,MockBackend],
        fakeAsync((svc, mockBackend) => {
            let res;
            mockBackend.connections.subscribe(c => {
              expect(c.request.url).toBe(`http://${svcHost}:${svcPort}/hosts`);
              let response = new ResponseOptions({body: '{"name": "fwsse37", "id": "1", "time_zone": "US/Eastern"}'});
              c.mockRespond(new Response(response));
          });
            expectURL = mockBackend, `http://${svcHost}:${svcPort}/hosts`;
            svc.getHosts().subscribe((res_) => {
              res = res_;
            });
            tick();
            expect(res.name).toBe('fwsse37');
            expect(res.id).toBe('1');
            expect(res.time_zone).toBe('US/Eastern');
          }))
    );
  });
});
