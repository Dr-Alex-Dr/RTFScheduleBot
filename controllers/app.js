const fs = require('fs');
const path = require('path');

function copyFile(filePath) {
    fs.copyFile(filePath, `${process.cwd()}/chedules/${234123453}.ics`, err => {
        if(err) throw err; 
    });
}

copyFile('C:/Users/DNS/Downloads/2023-08-30 16-26 ModeusCalendar 22 мая—28 мая 15 events.ics')


function findFile() {
    return new Promise((resolve, reject) => {
        fs.readdir('C:/Users/DNS/Downloads', (err, files) => {
            if(err) throw err;

            const icsFiles = files.filter(file => path.extname(file) === '.ics');

            resolve(`${'C:/Users/DNS/Downloads'}/${icsFiles[0]}`)
        })
    })
}

// findFile().
// then(res => {
//     console.log(res)
// })

