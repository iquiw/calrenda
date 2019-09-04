import { SVG } from '@svgdotjs/svg.js';

import { CalRendaModel, AllDayEntry, PeriodEntry } from './lib/model';
import { CalEntryCollision, CalRenda } from './lib/renda';

window.document.addEventListener('DOMContentLoaded', function() {
  let model = new CalRendaModel(new CalEntryCollision());

  model.addEntry(new PeriodEntry('ミーティング', [[9, 15], [11, 15]]));
  model.addEntry(new PeriodEntry('外出はあまりしないがたまにないこともない', [[13, 45], [15, 30]], { color: '#fbf' }));
  model.addEntry(new PeriodEntry('会議', [[13, 45], [15, 30]]));
  model.addEntry(new PeriodEntry('会議', [[14, 0], [15, 0]]));
  model.addEntry(new PeriodEntry('会議', [[13, 0], [16, 0]]));
  model.addEntry(new PeriodEntry('会議', [[13, 0], [14, 0]]));
  model.addEntry(new PeriodEntry('会議', [[14, 0], [16, 0]]));
  model.addEntry(new PeriodEntry('会議', [[16, 0], [17, 0]]));
  model.addEntry(new PeriodEntry('健康診断', [[9, 0], [12, 0]], { color: '#fbf' }));
  model.addEntry(new PeriodEntry('健康診断', [[9, 0], [12, 0]], { color: '#bff' }));
  model.addEntry(new PeriodEntry('ミーティング', [[10, 0], [10, 15]]));
  model.addEntry(new PeriodEntry('ミーティング', [[10, 15], [10, 30]]));
  model.addEntry(new PeriodEntry('ミーティング', [[11, 0], [11, 30]]));
  model.addEntry(new AllDayEntry('休暇', { color: '#fbb' }));

  let renda = new CalRenda(document.getElementById('drawing'), model);
  renda.drawCal();
});
