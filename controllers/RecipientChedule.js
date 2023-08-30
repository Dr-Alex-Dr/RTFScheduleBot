const {Builder, By, until } = require('selenium-webdriver');
const userAgents = require('top-user-agents')
const Chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

/**
* Класс считывает расписание пользователя.
*/
class RecipientChedule {
    /**
    * Конструктор присваивает значения полям класса.
    * @param {string} email - Почта пользователя.
    * @param {string} password - Пароль пользователя.
    * @param {string} userId - UserId telegram.
    * @param {string} cheduleFolderPath - Путь до папки загрузок
    */
    constructor(email, password, userId, cheduleFolderPath) {
        this.email = email;
        this.password = password;
        this.userId = userId.toString();
        this.cheduleFolderPath = cheduleFolderPath;
    }

    /**
     * Метод ищет файл с расписанием в папке загрузок.
     * @returns {string} Путь до файла с расписанием.
     */
    findFile() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.cheduleFolderPath, (err, files) => {
                if(err) throw err;
    
                const icsFiles = files.filter(file => path.extname(file) === '.ics');
                console.log('filePath  ' + `${this.cheduleFolderPath}/${icsFiles[0]}`)
                resolve(`${this.cheduleFolderPath}/${icsFiles[0]}`)
            })
        })
    }

    
    /**
     * Метод копирует файл из папки загрузок в папку с рассписанием и переименовываенм его в user id
     * @param {string} filePath - Путь до файла с расписанием.
     */
    copyFile(filePath) {
        fs.copyFile(filePath, `${process.cwd()}/chedules/${this.userId}.ics`, err => {
            if(err) throw err; 
        });
    }
    
    /**
     * Метод удаляет файл с расписанием в папке загрузок
     * @param {string} filePath - Путь до файла с расписанием.
     */
    deleteFile(filePath) {
        fs.unlink(filePath, (err) => {
            if(err) throw err;
        });
    }

    /**
     * Метод сохраняет полученные данные в файл.
     */
    async saveFile() {
        const icsfilePath = await this.findFile(); 
        console.log(icsfilePath)
        setTimeout(() => {
            this.copyFile(icsfilePath);
        }, 6000);  
        await this.deleteFile(icsfilePath);
    }

    /**
     * Метод парсит данные с https://urfu.modeus.org, по окончанию вызывает функцию saveFile.
    */
    async parser() {
        const Options = await new Chrome.Options();

        await Options.addArguments(userAgents[0])
        await Options.excludeSwitches("enable-logging");
        await Options.addArguments("--disable-blink-features=AutomationControlled");

        try {
            let driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(Options)
            .setCapability('goog:loggingPrefs', { 'browser':'ALL' })
            .build();

            // тут добавить текущую неделю.
            await driver.get("https://urfu.modeus.org/schedule-calendar/my?timeZone=%22Asia%2FYekaterinburg%22&calendar=%7B%22view%22:%22agendaWeek%22,%22date%22:%222023-05-22%22%7D&grid=%22Grid.07%22"); 
            await driver.wait(until.elementLocated(By.css('input[type="email"]')), 2000).sendKeys(this.email);
            await driver.wait(until.elementLocated(By.css('input[type="Password"]')), 2000).sendKeys(this.password);
            await driver.findElement(By.id('submitButton')).click();

            setTimeout(() => {driver.wait(until.elementLocated(By.className('icon-icalendar')), 2000).click()}, 3000)

            setTimeout(() => {
                //driver.quit();
                this.saveFile();
            }, 8000)

        }
        catch(err) {
            console.log(err);
            driver.quit();
        }
    }
}



module.exports = { RecipientChedule }