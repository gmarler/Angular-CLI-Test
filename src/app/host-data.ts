import { InMemoryDbService } from 'angular-in-memory-web-api';
export class HostData implements InMemoryDbService {
  createDb() {
    let hosts = [
      { id: 1, name: 'fwsse37',  time_zone: 'US/Central' },
      { id: 2, name: 'fwsse38',  time_zone: 'US/Central' },
      { id: 3, name: 'control',  time_zone: 'US/Eastern' },
      { id: 4, name: 'kaos',     time_zone: 'US/Eastern' },
      { id: 5, name: 'sundev51', time_zone: 'US/Eastern' },
      { id: 6, name: 'pine',     time_zone: 'US/Pacific' }
    ];
    return {hosts};
  }
}