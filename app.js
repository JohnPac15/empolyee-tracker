const cTable = require("console.table");
const inquirer = require("inquirer");
const db = require("./db/connection");

function showDepartments(data) {
  outputArray = [];
  for (let i = 0; i < data.length; i++) {
    let output = outputArray.push(data[i].id);
  }
 
  return outputArray;
}

function showRoles(data) {
  outputArray = [];
  for (i = 0; i < data.length; i++) {
    let output = outputArray.push(data[i].id);
  }
  return outputArray;
}

function showEmployees(data) {
  outputArray = []
  for(i=0;i<data.length;i++){
    let output = {
      name: data[i].first_name,
      value: data[i].id
    }
    outputArray.push(output)
  }
  console.log(outputArray,'---inloop')

  return outputArray;
}


const viewDepartments = function (title) {
  const sql = `SELECT * FROM department`;
  console.log(`---DEPARTMENTS---`);

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    return init();
  });
};

const addDepartment = function (title) {
  inquirer
    .prompt([
      {
        type: "text",
        name: "name",
        message: "What is the name of the department?",
      },
    ])
    .then((data) => {
      const sql = `INSERT INTO department(name) VALUES(?)`;
      const params = data.name;
      console.log(`---${params}result---`);

      db.query(sql, params, (err, result) => {
        if (err) {
          throw err;
        } else {
          viewDepartments();
          return init();
        }
      });
    });
};

const viewRoles = function (title) {
  const sql = `SELECT roles.id,roles.title,roles.salary, department.name AS Department FROM roles JOIN department ON roles.department_id = department.id;`;
  console.log(`---ROLES---`);

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    return init();
  });
};

const addRole = function () {
  const sqlDepartment = `SELECT * FROM department`;
  console.log(`---SELECT THE DEPARTMENT THIS ROLE BELONGS TOO---`);

  db.query(sqlDepartment, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.table(result);
      inquirer
        .prompt([
          {
            type: "text",
            name: "title",
            message: "What is the role title ?",
          },
          {
            type: "text",
            name: "salary",
            message: "What is the role salary ?",
          },
          {
            type: "list",
            name: "department",
            message:
              "Please reference from list above which department this role belongs too",
            choices: showDepartments(result),
          },
        ])
        .then((data) => {
          console.log(data, "---");
          const sql = `INSERT INTO roles(title, salary, department_id) VALUES(?,?,?)`;
          const params = [data.title, data.salary, data.department];

          db.query(sql, params, (err, result) => {
            if (err) {
              console.log(err);
              throw err;
            } else {
              console.table(result);
              return viewRoles();
            }
          });
        });
    }
  });
};

const viewEmployee = function (title) {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS role, employee.manager_id AS manager FROM employee JOIN roles ON employee.role_id = roles.id;`;
  console.log(`---EMPLOYEES---`);

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    return init();
  });
};

const addEmployee = function () {
  const sqlROLES = `SELECT roles.id,roles.title,roles.salary, department.name AS Department FROM roles JOIN department ON roles.department_id = department.id;`;
  console.log(`---ROLES---`);

  db.query(sqlROLES, (err, results) => {
    if (err) {
      throw err;
    } else {
      console.table(results);
      inquirer
        .prompt([
          {
            type: "text",
            name: "first_name",
            message: "What is the employees firts name?",
          },
          {
            type: "text",
            name: "last_name",
            message: "What is the employees last name?",
          },
          {
            type: "list",
            name: "role",
            message: "Please select a role for this employee",
            choices: showRoles(results),
          },
        ])
        .then((data) => {
          console.log(data);
          const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?);`;
          const params = [
            data.first_name,
            data.last_name,
            data.role,
          ];

          const sqlEmployee =`SELECT employee.id, employee.first_name FROM employee;`;
          console.log(`---EMPLOYEES---`);

          db.query(sqlEmployee, (err, result) => {

            if(err){
              throw err
            } else{
              console.table(result,'--in the else')
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: 'Who is the manager?',
                  choices: showEmployees(result)
                }
              ]).then(data => {
                params.push(data.manager)
                console.log(params, '---')

                db.query(sql,params, (err, results) => {
                  if (err) {
                    throw err;
                  } else {
                    console.table(results)
                    return viewEmployee()
                  }
                });

              })

            }
          })

        });
    }
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
        addDepartment(data.test);
      }
      if (data.test === "add a role") {
        addRole(data.test);
      }
      if (data.test === "add an employee") {
        addEmployee(data.test);
      }
      if (data.test === "update an employee role") {
      }
      if (data.test === "STOP") {
        return;
      }
    });
};

init();
