import { CalRendaModel, AllDayEntry, PeriodEntry } from './lib/model';
import { CalRenda } from './lib/renda';
import { Period, Time } from './lib/time';

window.document.addEventListener('DOMContentLoaded', function() {
  let model = new CalRendaModel();

  model.addEntry(new PeriodEntry('ミーティング', new Period(new Time(9, 15), new Time(11))));
  model.addEntry(new PeriodEntry('外出はあまりしないがたまにないこともない', new Period(new Time(13, 45), new Time(15, 30)), { color: '#fbf' }));
  model.addEntry(new PeriodEntry('会議', new Period(new Time(13, 45), new Time(15, 30))));
  model.addEntry(new PeriodEntry('健康診断', new Period(new Time(9), new Time(12)), { color: '#fbf' }));
  model.addEntry(new PeriodEntry('健康診断', new Period(new Time(9), new Time(12)), { color: '#bff' }));
  model.addEntry(new AllDayEntry('休暇', { color: '#fbb' }));

  let renda = new CalRenda('#drawing', model);
  renda.drawCal();
});
