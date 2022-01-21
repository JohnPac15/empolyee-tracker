const cTable = require("console.table");
const inquirer = require("inquirer");
const db = require('./db/connection')

const viewDepartments = function (title) {
  const sql = `SELECT * FROM department`;
  console.log(`---DEPARTMENTS---`);

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    return init();
  });
};

const addDepartment = function(title) {
  inquirer.prompt([
    {
      type: 'text',
      name: 'name',
      message: 'What is the name of the department?'
    }
  ]).then(data => {
    const sql =`INSERT INTO department(name) VALUES(?)`
    const params = data.name
    console.log(`---${params}result---`)

    db.query(sql, params, (err, result) =>{
      if(err){
        throw err
      } else{

        viewDepartments()
        return init()
      }
    })

  })
}

const viewRoles = function (title) {
  const sql = `SELECT roles.id,roles.title,roles.salary, department.name AS Department FROM roles JOIN department ON roles.department_id = department.id;`;
  console.log(`---ROLES---`);

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    return init();
  });
};

const addRole = function(){
  inquirer.prompt
}

const viewEmployee = function (title) {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS title, employee.manager_id FROM employee JOIN roles ON employee.role_id = roles.id;`;
  console.log(`---EMPLOYEES---`);

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    return init();
  });
};
//   view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const init = function () {
  inquirer
    .prompt([
      {
        type: "list",
        name: "test",
        message: "Please select a table",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
          "STOP",
        ],
      },
    ])
    .then((data) => {
     
      if (data.test === "view all departments") {
        viewDepartments(data.test);
      }
      if (data.test === "view all roles") {
        viewRoles(data.test);
      }
      if (data.test === "view all employees") {
        viewEmployee(data.test);
      }
      if (data.test === "add a department") {
        addDepartment(data.test)
      }
      if (data.test === "add a role") {
      }
      if (data.test === "add an employee") {
      }
      if (data.test === "update an employee role") {
      }
      if (data.test === "STOP") {
        return;
      }
    });
};

init();