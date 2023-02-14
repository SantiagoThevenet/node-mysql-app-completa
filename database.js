const mysql = require('mysql2/promise')
const { database } = require('./keys') 

const pool = mysql.createPool(database)



module.exports = {pool}