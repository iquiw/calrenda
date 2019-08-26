import { Time, Period } from './time';

type PeriodTuple = [[number, number], [number, number]];
type Options = { color?: string };

export abstract class Entry {
  readonly period: Period;
  readonly color: string;

  constructor(readonly summary: string, [start, end]: PeriodTuple, options?: Options) {
    this.summary = summary;
    this.period = new Period(new Time(start[0], start[1]), new Time(end[0], end[1]));
    this.color = options && options.color || '#ff8';
  }

  get start(): Time {
    return this.period.start;
  }

  get end(): Time {
    return this.period.end;
  }

  get periodString(): string {
    return this.period.toString();
  }

  extendedIntersect(other: Entry): boolean {
    let extended = this.period.extend();
    let otherExtended = other.period.extend();
    return extended.intersect(otherExtended);
  }
}

export class PeriodEntry extends Entry {
  constructor(summary: string, period: PeriodTuple, options?: Options) {
    super(summary, period, options);
  }
}

export class AllDayEntry extends Entry {
  constructor(summary: string, options?: Options) {
    super(summary, [[0, 0], [24, 0]], options);
  }

  get periodString() {
    return '終日';
  }
}

export class CalRendaModel {
  private entryRows: Entry[][];

  constructor() {
    this.entryRows = [];
  }

  get rowCount(): number {
    return this.entryRows.length;
  }

  addEntry(entry: Entry): number {
    let row = 0;
    for (; row < this.entryRows.length; row++) {
      let intersect = false;
      for (let other of this.entryRows[row]) {
        if (entry.extendedIntersect(other)) {
          intersect = true;
          break;
        }
      }
      if (!intersect) {
        this.entryRows[row].push(entry);
        break;
      }
    }
    if (row >= this.entryRows.length) {
      this.entryRows.push([entry]);
    }
    return row;
  }

  *entries(): IterableIterator<[number, Entry]> {
    let row = 0;
    for (let entryRow of this.entryRows) {
      for (let entry of entryRow) {
        yield [row, entry];
      }
      row++;
    }
  }
}
