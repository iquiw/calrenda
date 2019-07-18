import { SVG } from '@svgdotjs/svg.js';

import { CalRendaModel } from './model';

const HOUR_WIDTH = 100;
const MIN15_WIDTH = HOUR_WIDTH / 4;
const HEADER_HEIGHT = 20;
const ROW_HEIGHT = 50;
const STROKE_COLOR = '#aac';

const START_HOUR = 8;
const END_HOUR = 19;

export class CalRenda {
  private width: number;
  private height: number;
  private draw;

  constructor(id: string, private model: CalRendaModel) {
    this.width = HOUR_WIDTH * (END_HOUR - START_HOUR);
    this.height = model.getRowCount() * ROW_HEIGHT + 40;
    this.draw = SVG().addTo(id).size(this.width, this.height);
  }

  drawCal() {
    this.drawHeader();
    for (let rowEntry of this.model.entries()) {
      this.drawEntry(rowEntry[0], rowEntry[1]);
    }
  }

  drawBorder(x0, y0, x1, y1) {
    this.draw.line(x0, y0, x1, y1).stroke({ color: STROKE_COLOR, width: 1 });
  }

  drawHeader() {
    this.drawBorder(0, 1, this.width, 1);
    let offset = 0;
    for (let i = START_HOUR; i < END_HOUR; i++) {
      if (i > START_HOUR) {
        this.drawBorder(offset, 0, offset, this.height);
      }
      this.draw.text(`${i}:00`).dx(offset + 5).dy(-5);
      offset += HOUR_WIDTH;
    }
    this.drawBorder(0, HEADER_HEIGHT, this.width, HEADER_HEIGHT);
  }

  drawEntry(row, entry) {
    let x0 = this.timeToOffset(entry.getStart());
    let x1 = this.timeToOffset(entry.getEnd());
    let width = x1 - x0;

    this.draw
      .rect(x1 - x0, ROW_HEIGHT)
      .attr({ fill: entry.color, stroke: STROKE_COLOR, opacity: 0.8, x: x0, y: HEADER_HEIGHT + ROW_HEIGHT * row });
    let text = entry.summary;
    let textLen = text.length;
    let maxTextLen = Math.max((width - 5) / 14 - 1, HOUR_WIDTH / 14);
    console.log(textLen, maxTextLen);
    if (textLen > maxTextLen) {
      text = text.substring(0, maxTextLen) + '..';
    }
    this.draw.text(text).font({ size: '14' }).dx(x0 + 5).dy(HEADER_HEIGHT + ROW_HEIGHT * row);
    this.draw.text(entry.getPeriod())
      .font({ size: '12' })
      .attr({ fill: '#666' })
      .dx(x0 + 5).dy(HEADER_HEIGHT + ROW_HEIGHT * row + 20);
  }

  timeToOffset(time) {
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
