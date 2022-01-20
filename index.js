const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require("mysql2");

const { test } = require('media-typer');

// Connect to database
const db = mysql.createConnection(
    {
      host: "localhost",
      user: "project",
      password: "password",
      database: "work_force",
    },
    console.log("Connected to the election database")
  );

const init = function() {
    inquirer.prompt([
        {
        type: 'list',
        name: 'test',
        message: 'Please select a table',
        choices: ['departments', 'roles','employee']
        }

    ]).then(data => {
        console.log(data.test)
        if(data.test === "roles"){
            const sql =`SELECT * FROM employee`;
            const params = [1,'lead Engineer', 100000, 1]
            db.query(sql, (err, results) => {
                if(err) throw err
                console.table(results)
            })
        }
    })
}

init()