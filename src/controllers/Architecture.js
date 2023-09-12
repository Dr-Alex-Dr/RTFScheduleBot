class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    sendMessage() {

    }

    registrationUser() {

    }

    checkUser() {

    }
}

class Chedule extends User {
    constructor() {
        
    }

    upload() {

    }

    unload() {

    }

    read() {

    }
}

class ParserChedule extends Chedule {
    constructor() {
        
    }

    parse() {

    }

    transformJson() {
        
    }
}


let i = 'Лабораторное занятие 9'
console.log(i.toLowerCase().includes('лаб'))
