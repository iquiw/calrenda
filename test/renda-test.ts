import test from 'ava';

const { createSVGWindow } = require('svgdom');
const { SVG, registerWindow } = require('@svgdotjs/svg.js');

import { Time } from '../lib/time';
import { CalRendaModel } from '../lib/model';
import { CalRenda } from '../lib/renda';

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
