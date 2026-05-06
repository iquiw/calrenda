import test from 'ava';

import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';

import { Time } from '../lib/time.ts';
import { CalRendaModel } from '../lib/model.ts';
import { CalRenda } from '../lib/renda.ts';

const window = createSVGWindow();
const document = window.document;
registerWindow(window, document);
const canvas = SVG(document.documentElement);

test('time to offset', t => {
  const model = new CalRendaModel();
  const renda = new CalRenda(canvas, model);

  t.is(renda.timeToOffset(new Time(8, 0)), 0);
  t.is(renda.timeToOffset(new Time(9, 0)), 100);
  t.is(renda.timeToOffset(new Time(10, 45)), 275);
  t.is(renda.timeToOffset(new Time(18, 15)), 1025);
});
