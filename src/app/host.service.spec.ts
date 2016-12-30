/* tslint:disable:no-unused-variable */

import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import {MockBackend} from '@angular/core/testing';
import {Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions} from '@angular/http';
import { HostService } from './host.service';

describe('HostService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HostService]
    });
  });

  it('should ...', inject([HostService], (service: HostService) => {
    expect(service).toBeTruthy();
  }));
});
