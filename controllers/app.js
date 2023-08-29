const ical = require('node-ical');
const moment = require('moment');

// use the sync function parseFile() to parse this ics file
const events = ical.sync.parseFile('calendar.ics');
// loop through events and log them

for (const event of Object.values(events)) {   
    console.log(moment(event.start, 'DD.MM.YY'));
};