import { EventEmitter } from "events";

export class Emitter {
  private static _events: EventEmitter;

  private get events(): EventEmitter {
    return Emitter._events;
  }

  public constructor() {
    if (!Emitter._events) {
      Emitter._events = new EventEmitter();
    }
  }

  public emit(input: {event: string, payload: any}): Emitter {
    this.events.emit(input.event, input.payload);
    return this;
  }

  public on(event: string, fn: (...args: any[]) => void): Emitter {
    this.events.on(event, fn);
    return this;
  }

  public once(event: string, fn: (...args: any[]) => void): Emitter {
    this.events.once(event, fn);
    return this;
  }
}
