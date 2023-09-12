import mysql, { Pool } from 'mysql2';
import 'dotenv/config';

class Database {
    private pool: Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.MYSQL_HOST, 
            user: process.env.MYSQL_USER, 
            database: process.env.MYSQL_DARABASE, 
            password: process.env.MYSQL_PASSWORD, 
        }); 
    }

    public query<T>(sql: string): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            this.pool.query(sql, (err: any, rows: T[]) => {
                if (err) reject(err);          
                resolve(rows);
            })
        })
    }
}

// interface IUser {
//     '1 + 1': string
// }

// const db = new Database();

// db.query<IUser>('select 1 + 1').
// then(res => {
//     console.log(res)
// })
// .catch(err => {
//     console.log(err)
// })
