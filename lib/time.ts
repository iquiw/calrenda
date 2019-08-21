export class Time {
  constructor(readonly hour: number = 0, readonly minute: number = 0) {}

  diff(other: Time): number {
    return this.toMinute() - other.toMinute();
  }

  private toMinute(): number {
    return this.hour * 60 + this.minute;
  }

  compareTo(other: Time): number {
    return this.diff(other);
  }

  toString(): string {
    let s = '' + this.hour + ':';
    if (this.minute < 10) {
      s += '0';
    }
    s += this.minute;
    return s;
  }
}

export class Period {
  constructor(readonly start: Time, readonly end: Time) {}

  toString(): string {
    return this.start.toString() + ' ~ ' + this.end.toString();
  }

  extend(): Period {
    const diff = this.end.diff(this.start);
    if (diff < 60) {
      return new Period(
        this.start,
        new Time(this.start.hour + 1, this.start.minute)
      );
    }
    return new Period(this.start, this.end);
  }

  intersect(other: Period): boolean {
    return (
      (this.start.compareTo(other.start) >= 0 &&
        this.start.compareTo(other.end) < 0) ||
      (other.start.compareTo(this.start) >= 0 &&
        other.start.compareTo(this.end) < 0)
    );
  }
}
