import { SVG, Svg } from '@svgdotjs/svg.js';

import { CalRendaModel, Entry, ExtendedPeriodCollision } from './model';
import { Time, Period } from './time';

const HOUR_WIDTH = 100;
const MIN15_WIDTH = HOUR_WIDTH / 4;
const HEADER_HEIGHT = 20;
const ROW_HEIGHT = 50;
const HEADER_COLOR = '#eee';
const STROKE_COLOR = '#aac';

const START_HOUR = 8;
const END_HOUR = 19;

const FONT_SIZE = 14;

export class CalEntryCollision extends ExtendedPeriodCollision {
  collide(entry1: Entry, entry2: Entry): boolean {
    let period1 = this.extendedPeriod(entry1);
    let period2 = this.extendedPeriod(entry2);
    return super.periodCollide(period1, period2);
  }

  private extendedPeriod(entry: Entry): Period {
    let period = entry.period;
    let textLen = entry.summary.length * FONT_SIZE;
    let periodLen = entry.end.diff(entry.start) / 60 * HOUR_WIDTH;
    if (textLen > periodLen) {
      let hour = Math.floor(textLen / HOUR_WIDTH + entry.start.hour + entry.start.minute / 60);
      let minute = Math.floor(textLen % HOUR_WIDTH * 60 / HOUR_WIDTH);
      return new Period(
        new Time(period.start.hour, period.start.minute),
        new Time(hour, minute));
    }
    return period;
  }
}

export class CalRenda {
  private width: number;
  private height: number;
  private draw: Svg;

  constructor(id: string, private model: CalRendaModel) {
    this.width = HOUR_WIDTH * (END_HOUR - START_HOUR);
    this.height = model.rowCount * ROW_HEIGHT + 40;
    this.draw = SVG().addTo(id).size(this.width, this.height);
  }

  drawCal() {
    this.drawHeader();
    for (let rowEntry of this.model.entries()) {
      this.drawEntry(rowEntry[0], rowEntry[1]);
    }
  }

  drawBorder(x0: number, y0: number, x1: number, y1: number) {
    this.draw.line(x0, y0, x1, y1).stroke({ color: STROKE_COLOR, width: 1 });
  }

  drawHeader() {
    let offset = 0;
    for (let i = START_HOUR; i < END_HOUR; i++) {
      this.draw
        .rect(HOUR_WIDTH, HEADER_HEIGHT - 1)
        .attr({ fill: HEADER_COLOR, stroke: STROKE_COLOR, x: offset, y: 1 });
      if (i > START_HOUR) {
        this.drawBorder(offset, 1, offset, this.height);
      }
      this.draw.text(`${i}:00`).dx(offset + 5).dy(-5);
      offset += HOUR_WIDTH;
    }
  }

  drawEntry(row: number, entry: Entry) {
    let x0 = this.timeToOffset(entry.start);
    let x1 = this.timeToOffset(entry.end);

    this.draw
      .rect(x1 - x0, ROW_HEIGHT)
      .attr({ fill: entry.color, stroke: STROKE_COLOR, opacity: 0.8, x: x0, y: HEADER_HEIGHT + ROW_HEIGHT * row });
    this.draw.text(entry.summary)
      .font({ size: FONT_SIZE })
      .dx(x0 + 5).dy(HEADER_HEIGHT + ROW_HEIGHT * row);
    this.draw.text(entry.periodString)
      .font({ size: '12' })
      .attr({ fill: '#666' })
      .dx(x0 + 5).dy(HEADER_HEIGHT + ROW_HEIGHT * row + 20);
  }

  timeToOffset(time: Time) {
    let hour = time.hour;
    let min = time.minute;

    let offset = (hour - START_HOUR) * HOUR_WIDTH + (min / 15) * MIN15_WIDTH;
    if (offset < 0) {
      offset = -1;
    } else if (offset > this.width) {
      offset = this.width;
    }
    return Math.floor(offset);
  }
}
