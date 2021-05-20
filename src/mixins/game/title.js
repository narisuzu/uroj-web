import moment from 'moment/moment';

export default function newTitle(title, two) {
  const text = two.makeText(title, 0, 0, undefined);
  const clock = two.makeText(moment().format('HH:mm:ss'), 0, 40, undefined);

  setInterval(() => {
    clock.value = moment().format('HH:mm:ss')
  }, 1000);

  const group = two.makeGroup(clock, text);
  group.fill = '#fff';
  text.size = 40;
  clock.size = 30;
  group.translation.set(two.width / 2, text.size);

  return group;
}
