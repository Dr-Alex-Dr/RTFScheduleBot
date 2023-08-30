const chedule = require('../res.json');

class ReaderChedule {
    constructor(chedule) {
        this.chedule = chedule;

        this.countSubjects = chedule._embedded.events.length;
        this.countNamesSubjects = chedule._embedded['cycle-realizations'].length;
        this.countLocations = chedule._embedded['event-locations'].length;
        this.countEventRooms = chedule._embedded['event-rooms'].length;
        this.countRooms = chedule._embedded['rooms'].length;
    }   

    reader() {    
        for (let i = 0; i < this.countSubjects; i++) {
            let subjectId = this.chedule._embedded.events[i]._links['cycle-realization'].href.replace('/','');
            let eventId = this.chedule._embedded.events[i]._links.location.href.replace('/location','').replace('/', '');

            let start = this.chedule._embedded.events[i].startsAtLocal;
            let end = this.chedule._embedded.events[i].endsAtLocal;

           
         
            // Названия предметов
            let nameSubject = this.chedule._embedded['cycle-realizations'].filter(item => {
                return item.id === subjectId
            });

            // Разположение корпусов
            let locationSubject = this.chedule._embedded['event-locations'].filter(item => {
                return item.eventId === eventId
            })


            let location;

            try {
                let eventRooms = locationSubject[0]._links['event-rooms'].href.replace('/','');

                let roomId = this.chedule._embedded['event-rooms'].filter(item => {
                    return item.id === eventRooms;
                });
                
                let room = roomId[0]._links.room.href.replace('/','');

                let locationObject = this.chedule._embedded['rooms'].filter(item => {
                    return item.id === room;
                });

                location = locationObject[0].name;
            }
            catch {
                location = locationSubject[0].customLocation;
            }
            
           

            

            // // Место нахождения и id event room
            // for (let c = 0; c < this.countLocations; c++) {
            //     let locationId = this.chedule._embedded['event-locations'][c].eventId;

            //     if (eventId === locationId) {
            //         locationSubject = this.chedule._embedded['event-locations'][c].customLocation;

                    
            //     }
            // }

            console.log(nameSubject[0].code + '\n' + location + '\n' +  start + '\n' +  end)
        }

    }   
}

let read = new ReaderChedule(chedule);
read.reader()