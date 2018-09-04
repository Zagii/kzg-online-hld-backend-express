const util = require('util');
const mysql = require( 'mysql' );

var pool = mysql.createPool({
    connectionLimit: 10,
    host     : '10.22.23.82', 
    user     : 'eakzg',
    password : 'a',
    database : 'eakzg_schema'
    });
   

    pool.getConnection((err, connection) => {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Database connection was closed.')
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('Database has too many connections.')
            }
            if (err.code === 'ECONNREFUSED') {
                console.error('Database connection was refused.')
            }
        }
    
        if (connection) connection.release()
    
        return
    })
    pool.query = util.promisify(pool.query) // Magic happens here.
    
    module.exports = pool