import test from 'ava';

import { Time, Period } from '../lib/time';

test('time constructor and accessors', t => {
  const time = new Time(1, 2);
  t.is(time.hour, 1);
  t.is(time.minute, 2);
});

test('time constructor with default values', t => {
  let time = new Time(1);
  t.is(time.minute, 0);

  time = new Time()
  t.is(time.hour, 0);
  t.is(time.minute, 0);
});

test('time compares', t => {
  t.true(new Time(1).compareTo(new Time(0)) > 0);
  t.true(new Time(3).compareTo(new Time(1)) > 0);
  t.true(new Time(0).compareTo(new Time(1)) < 0);
  t.true(new Time(1).compareTo(new Time(3)) < 0);

  t.true(new Time(10, 1).compareTo(new Time(10, 0)) > 0);
  t.true(new Time(10, 9).compareTo(new Time(9, 10)) > 0);
  t.true(new Time(9, 10).compareTo(new Time(10, 9)) < 0);

  t.is(new Time(0).compareTo(new Time(0)), 0);
  t.is(new Time(10).compareTo(new Time(10)), 0);
  t.is(new Time(3, 30).compareTo(new Time(3, 30)), 0);
});

test('time to string', t => {
  t.is(new Time(0, 0).toString(), '0:00');
  t.is(new Time(5, 6).toString(), '5:06');
  t.is(new Time(12, 34).toString(), '12:34');
});

test('period to string', t => {
  t.is(new Period(new Time(), new Time()).toString(), '0:00 ~ 0:00')
  t.is(new Period(new Time(1, 2), new Time(34, 56)).toString(), '1:02 ~ 34:56')
});

test('period extend', t => {
  t.deepEqual(new Period(new Time(10), new Time(11)).extend(), new Period(new Time(10), new Time(11)));
  t.deepEqual(new Period(new Time(10, 10), new Time(10, 20)).extend(), new Period(new Time(10, 10), new Time(11, 10)));
});

test('period intersect', t => {
  t.true(new Period(new Time(20), new Time(22)).intersect(new Period(new Time(20), new Time(22))));
  t.true(new Period(new Time(20), new Time(22)).intersect(new Period(new Time(21), new Time(23))));
  t.true(new Period(new Time(21), new Time(23)).intersect(new Period(new Time(20), new Time(22))));
  t.true(new Period(new Time(20), new Time(23)).intersect(new Period(new Time(21), new Time(22))));
  t.true(new Period(new Time(21, 15), new Time(21, 30)).intersect(new Period(new Time(21), new Time(22))));

  t.false(new Period(new Time(21, 15), new Time(21, 45)).intersect(new Period(new Time(21, 45), new Time(22))));
});
