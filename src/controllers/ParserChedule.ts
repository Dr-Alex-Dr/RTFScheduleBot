const {Builder, By, until } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');
const moment = require('moment');
//const chedule = require('../res.json');

class ParserChedule{

    sleep(ms: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => { resolve() }, ms);
        })
    }

    async parse(email: string, password: string, startDate: string, endDate: string) {
        const Options = await new Chrome.Options();
     
        await Options.excludeSwitches("enable-logging");
        await Options.addArguments("--disable-blink-features=AutomationControlled");
        await Options.addArguments('--headless=new');
    
        try {
            let driver = await new Builder().forBrowser('chrome').setChromeOptions(Options).build();
    
            await driver.get('https://urfu.modeus.org/');

            await driver.wait(until.elementLocated(By.css('input[type="email"]')), 2000).sendKeys(email);
            await driver.wait(until.elementLocated(By.css('input[type="Password"]')), 2000).sendKeys(password);
            await driver.findElement(By.id('submitButton')).click();
    
            await this.sleep(5000);
    
            // Ловим post запрос с рассписанием 
            const postRequest =  `const options = {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Cookie': document.cookie,
                  'Authorization': 'Bearer ' + sessionStorage.getItem('id_token')
                },
                body: JSON.stringify({
                  "size": 500,
                  "timeMin": \"${moment(startDate).format('YYYY-MM-DDTHH:mm:ssZ')}\",
                  "timeMax": \"${moment(endDate).format('YYYY-MM-DDTHH:mm:ssZ')}\",
                  "attendeePersonId": [
                    JSON.parse(sessionStorage.getItem('id_token_claims_obj')).person_id
                  ]
                }),
              };
              
            return new Promise((resolve, reject) => {
                fetch('https://urfu.modeus.org/schedule-calendar-v2/api/calendar/events/search?tz=Asia/Yekaterinburg&authAction=', options)
                .then(response => response.json())
                .then(data => {
                    resolve(data)
                })
            })  
            `
            
            let chedule = await driver.executeScript(postRequest)
            
            driver.quit();
            // console.log(typeof chedule)
            return this.reader(chedule)   
        }
        catch(err) {
            console.log(err);     
        }
    }

    reader(chedule: any): object[] { 
        let subjectArray = [];
        
        for (let i = 0; i < chedule._embedded.events.length; i++) {
            let startTime: string = chedule._embedded.events[i].startsAtLocal;
            let endTime: string = chedule._embedded.events[i].endsAtLocal;
            let type = this.filterNameType(chedule._embedded.events[i].name);
            let locationLesson;
            let nameSubject;
            let person;
         
            // Названия предметов
            let subjectId = chedule._embedded.events[i]._links['cycle-realization'].href.replace('/','');
            nameSubject = chedule._embedded['cycle-realizations'].filter((item: any) => {
                return item.id === subjectId
            });

            // Разположение корпусов
            let eventId = chedule._embedded.events[i].id;
            let locationSubject = chedule._embedded['event-locations'].filter((item: any) => {
                return item.eventId === eventId
            })

            // ФИО преподователя
            
            let eventOrganizers = chedule._embedded['event-organizers'].filter((item: any) => {
                return item.eventId === eventId;
            })

           
            if (Array.isArray(eventOrganizers[0]._links['event-attendees'])) {
                let personsArray = []
                
                for (let arrayItem of eventOrganizers[0]._links['event-attendees']) {
                    let eventAttendees = chedule._embedded['event-attendees'].filter((item: any) => {
                        return item.id === arrayItem.href.replace('/','');
                    })
                    person = chedule._embedded['persons'].filter((item: any) => {
                        return item.id === eventAttendees[0]._links['person'].href.replace('/','');
                    }) 
                    
                    personsArray.push(person[0].fullName);
                }

                person = personsArray
            } else {
                let eventAttendees = chedule._embedded['event-attendees'].filter((item: any) => {
                    return item.id === eventOrganizers[0]._links['event-attendees'].href.replace('/','');
                })
                
                person = chedule._embedded['persons'].filter((item: any) => {
                    return item.id === eventAttendees[0]._links['person'].href.replace('/','');
                })
          
                person = person[0].fullName;
            }

            try {
                let eventRooms = locationSubject[0]._links['event-rooms'].href.replace('/','');
                let roomId = chedule._embedded['event-rooms'].filter((item: any) => {
                    return item.id === eventRooms;
                });
                
                let room = roomId[0]._links.room.href.replace('/','');
                let locationObject = chedule._embedded['rooms'].filter((item: any) => {
                    return item.id === room;
                });

                locationLesson = locationObject[0].name;
            }
            catch {
                locationLesson = locationSubject[0].customLocation;
            }
             
            subjectArray.push({
                nameSubject: nameSubject[0].code,
                type,
                locationLesson,
                startTime,
                endTime,
                person
            })
            
        } 
        return subjectArray;   
    }  

    filterNameType(typeName: string) {
        let types = ['Лаб', 'Прак', 'Лек', 'Конс', 'Аттес', 'Экз', 'Дифф', 'Зачет', 'Онлайн']
        for (let item of types) {
            if (typeName.toLowerCase().includes(item.toLowerCase())) {
                return item;
            }
        }
        return typeName;
    }
}

let Parser = new ParserChedule();

// let cheduleSubjects = Parser.reader(chedule)
// console.log(cheduleSubjects)

Parser.parse('Alexey.Linkov@at.urfu.ru', 'Zoom-zoom1', '2023-03-12', '2023-03-27').
then(res => {
    console.log(res)
})



