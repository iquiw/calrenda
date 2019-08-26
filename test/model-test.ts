import test from 'ava';

import { Time } from '../lib/time';
import { AllDayEntry, CalRendaModel, PeriodEntry } from '../lib/model';

test('period entry constructor', t => {
  const entry = new PeriodEntry('summary', [[1, 2], [3, 4]]);

  t.is(entry.summary, 'summary');
  t.deepEqual(entry.start, new Time(1, 2));
  t.deepEqual(entry.end, new Time(3, 4));
});

test('period entry constructor with options', t => {
  const entry = new PeriodEntry('summary', [[10, 0], [11, 30]], { color: '#fff' });

  t.is(entry.summary, 'summary');
  t.deepEqual(entry.start, new Time(10, 0));
  t.deepEqual(entry.end, new Time(11, 30));
  t.is(entry.color, '#fff');
});

test('period entry period string', t => {
  const entry = new PeriodEntry('summary', [[0, 0], [23, 59]]);

  t.is(entry.periodString, '0:00 ~ 23:59');
});

test('allday entry constructor', t => {
  const entry = new AllDayEntry('summary');

  t.is(entry.summary, 'summary');
  t.deepEqual(entry.start, new Time(0, 0));
  t.deepEqual(entry.end, new Time(24, 0));
});

test('allday entry constructor with options', t => {
  const entry = new AllDayEntry('summary', { color: '#000'});

  t.is(entry.summary, 'summary');
  t.deepEqual(entry.start, new Time(0, 0));
  t.deepEqual(entry.end, new Time(24, 0));
  t.is(entry.color, '#000');
});

test('allday entry period string', t => {
  const entry = new AllDayEntry('summary');

  t.is(entry.periodString, '終日');
});

test('model constructor', t => {
  const model = new CalRendaModel();

  t.is(model.rowCount, 0);
  for (let _entry of model.entries()) {
    t.fail(); // not executed
  }
});

test('model single entry addition', t => {
  const entry = new AllDayEntry('summary');
  const model = new CalRendaModel();
  model.addEntry(entry);

  t.is(model.rowCount, 1);
  const entries = model.entries();
  t.deepEqual(entries.next().value, [0, entry]);
});

test('model multiple entry additions without intersect', t => {
  const model = new CalRendaModel();
  const entry1 = new PeriodEntry('summary1', [[1, 0], [2, 0]]);
  const entry2 = new PeriodEntry('summary2', [[2, 0], [3, 0]]);
  const entry3 = new PeriodEntry('summary3', [[3, 0], [4, 0]]);
  model.addEntry(entry1);
  model.addEntry(entry2);
  model.addEntry(entry3);

  t.is(model.rowCount, 1);
  const entries = model.entries();
  t.deepEqual(entries.next().value, [0, entry1]);
  t.deepEqual(entries.next().value, [0, entry2]);
  t.deepEqual(entries.next().value, [0, entry3]);
  t.true(entries.next().done);
});

test('model multiple entry additions with intersect', t => {
  const model = new CalRendaModel();
  const entry1 = new PeriodEntry('summary1', [[1, 0], [3, 0]]);
  const entry2 = new PeriodEntry('summary2', [[2, 0], [3, 0]]);
  const entry3 = new PeriodEntry('summary3', [[2, 0], [4, 0]]);
  model.addEntry(entry1);
  model.addEntry(entry2);
  model.addEntry(entry3);

  t.is(model.rowCount, 3);
  const entries = model.entries();
  t.deepEqual(entries.next().value, [0, entry1]);
  t.deepEqual(entries.next().value, [1, entry2]);
  t.deepEqual(entries.next().value, [2, entry3]);
  t.true(entries.next().done);
});

test('model multiple entry additions with and without intersect', t => {
  const model = new CalRendaModel();
  const entry1 = new PeriodEntry('summary1', [[1, 0], [3, 0]]);
  const entry2 = new PeriodEntry('summary2', [[2, 0], [4, 0]]);
  const entry3 = new PeriodEntry('summary3', [[3, 0], [5, 0]]);
  const entry4 = new PeriodEntry('summary4', [[4, 0], [5, 0]]);
  const entry5 = new PeriodEntry('summary5', [[1, 0], [5, 0]]);
  model.addEntry(entry1);
  model.addEntry(entry2);
  model.addEntry(entry3);
  model.addEntry(entry4);
  model.addEntry(entry5);

  t.is(model.rowCount, 3);
  const entries = model.entries();
  t.deepEqual(entries.next().value, [0, entry1]);
  t.deepEqual(entries.next().value, [0, entry3]);
  t.deepEqual(entries.next().value, [1, entry2]);
  t.deepEqual(entries.next().value, [1, entry4]);
  t.deepEqual(entries.next().value, [2, entry5]);
  t.true(entries.next().done);
});

test('model entry less than 1 hour period with intersect', t => {
  const entry1 = new PeriodEntry('summary1', [[1, 0], [1, 15]]);
  const entry2 = new PeriodEntry('summary2', [[1, 15], [1, 30]]);
  const model = new CalRendaModel();
  model.addEntry(entry1);
  model.addEntry(entry2);

  t.is(model.rowCount, 2);
  const entries = model.entries();
  t.deepEqual(entries.next().value, [0, entry1]);
  t.deepEqual(entries.next().value, [1, entry2]);
  t.true(entries.next().done);
});

