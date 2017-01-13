export class Host {
  name:      string;
  id:        number;
  time_zone: string;

  constructor(name: string, id: number, time_zone: string) {
    this.name = name;
    this.id   = id;
    this.time_zone = time_zone;
  }
}
