const { ReaderChedule } = require('./ReaderChedule');

const chedule = new ReaderChedule('Alexey.Linkov@at.urfu.ru', 'Zoom-zoom1', '968615914', 'C:/Users/DNS/Downloads')

test('find file in download folder', () => {
    return chedule.findFile().then(data => {
      expect(data).toBe('C:/Users/DNS/Downloads/2023-08-29 18-24 ModeusCalendar 22 мая—28 мая 15 events.ics');
    });
  });