import test from 'ava';

import { Time } from '../lib/time';
import { AllDayEntry, PeriodEntry } from '../lib/model';

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
