const {Builder, Browser, By, Key, until, Capabilities } = require('selenium-webdriver');
const UserAgent = require('user-agents');
const Chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const ical = require('node-ical');
const moment = require('moment');


const userAgent = new UserAgent();

const email = 'Alexey.Linkov@at.urfu.ru';
const pass = '';

async function parseOzon() {
  const Options = await new Chrome.Options();

  await Options.addArguments(userAgent.toString())
  await Options.excludeSwitches("enable-logging");
  await Options.addArguments("--disable-blink-features=AutomationControlled");
  //await Options.addArguments("headless");

  try {
    let driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(Options)
      .setCapability('goog:loggingPrefs', { 'browser':'ALL' })
      .build();

    await driver.get("https://urfu.modeus.org/schedule-calendar/my?timeZone=%22Asia%2FYekaterinburg%22&calendar=%7B%22view%22:%22agendaWeek%22,%22date%22:%222023-05-22%22%7D&grid=%22Grid.07%22"); 
    await driver.wait(until.elementLocated(By.css('input[type="email"]')), 2000).sendKeys(email);
    await driver.wait(until.elementLocated(By.css('input[type="Password"]')), 2000).sendKeys(pass);
    await driver.findElement(By.id('submitButton')).click();

    // Потом убрать, это для тестирования  
    await driver.wait(until.elementLocated(By.css('body')), 2000).click();
    await driver.wait(until.elementLocated(By.className('icon-icalendar')), 2000).click();

    setTimeout(() => {
        driver.quit();
        findFile();
    }, 6000)
 
  }
  catch(err) {
    console.log(err)
  }
};


parseOzon();

//findFile()
function findFile() {
    const folderPath = 'C:/Users/DNS/Downloads'; // Укажите путь к папке, в которой ищем файлы
    const fileExtension = '.ics'; // Расширение файла, которое ищем

    fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Ошибка при чтении папки:', err);
        return;
    }

    const icsFiles = files.filter(file => path.extname(file).toLowerCase() === fileExtension);

    if (icsFiles.length === 0) {
        console.log('В папке нет файлов с расширением .ics');
    } else {
        let icsFilePath = folderPath + '/' + icsFiles[0];
        readCalendar(icsFilePath);

        fs.unlink(icsFilePath, (err) => {
            if (err) {
              console.error('Ошибка при удалении файла:', err);
              return;
            }
          
            console.log('Файл успешно удален:', icsFilePath);
          });
    }
    });

}

function readCalendar(fileName) {
    const events = ical.sync.parseFile(fileName);
    
    for (const event of Object.values(events)) {
        console.log(moment(event.start).format('DD-MM'))
        console.log(event.summary)
        console.log(event.location)
        console.log(moment(event.start).format('HH:mm:ss'))
        console.log(moment(event.end).format('HH:mm:ss'))
        console.log('--------')
    };
}
