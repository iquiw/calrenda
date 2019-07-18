import { Time, Period } from './time';

export class Entry {
  readonly color: string;

  constructor(readonly summary: string, readonly period: Period, options = {}) {
    this.summary = summary;
    this.period = period;
    this.color = options && options.color || '#ff8';
  }

  getStart() {
    return this.period.start;
  }

  getEnd() {
    return this.period.end;
  }

  getPeriod() {
    return this.period.toString();
  }

  intersect(other) {
    return this.period.intersect(other.period);
  }
}

export class PeriodEntry extends Entry {
  constructor(summary, period, options) {
    super(summary, period, options);
  }
}

export class AllDayEntry extends Entry {
  constructor(summary, options) {
    super(summary, new Period(new Time(0, 0), new Time(24, 0)), options);
  }

  getPeriod() {
    return '終日';
  }
}

export class CalRendaModel {
  private entryRows: Entry[][];

  constructor() {
    this.entryRows = [];
  }

  getRowCount() {
    return this.entryRows.length;
  }

  addEntry(entry) {
    let row = 0;
    for (; row < this.entryRows.length; row++) {
      let intersect = false;
      for (let other of this.entryRows[row]) {
        if (entry.intersect(other)) {
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

  *entries() {
    let row = 0;
    for (let entryRow of this.entryRows) {
      for (let entry of entryRow) {
        yield [row, entry];
      }
      row++;
    }
  }
}
