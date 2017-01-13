export class Host {
  name:     string;
  id:       number;
  timeZone: string;

  constructor(name: string, id: number, timeZone: string) {
    this.name = name;
    this.id   = id;
    this.timeZone = timeZone;
  }
}
