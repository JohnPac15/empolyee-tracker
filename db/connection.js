const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: "localhost",
      user: "project",
      password: "password",
      database: "work_force",
    },
    console.log("Connected to the election database")
  );

  module.exports=db