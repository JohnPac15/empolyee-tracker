const cTable = require("console.table");
const inquirer = require("inquirer");
const { up } = require("inquirer/lib/utils/readline");
const db = require("./db/connection");

function showDepartments(data) {
  outputArray = [];
  for (let i = 0; i < data.length; i++) {
    let output = {
      name: data[i].name,
      value: data[i].id,
    };
    outputArray.push(output);
  }

  return outputArray;
}

function showRoles(data) {
  outputArray = [];
  for (i = 0; i < data.length; i++) {
    let output = {
      name: data[i].title,
      value: data[i].id,
    };
    outputArray.push(output);
  }
  return outputArray;
}

function showEmployees(data) {
  outputArray = [];
  for (i = 0; i < data.length; i++) {
    let output = {
      name: data[i].first_name,
      value: data[i].id,
    };
    outputArray.push(output);
  }

  return outputArray;
}

function showManager(data) {
  outputArray = [];
  for (i = 0; i < data.length; i++) {
    let output = {
      name: data[i].manager,
      value: data[i].id,
    };
    outputArray.push(output);
  }
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
  console.log(`---THE DEPARTMENT---`);

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
              "Which department this role belongs too",
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
  const sql = `SELECT E.id, E.first_name, E.last_name, roles.title, roles.salary, M.first_name AS manager FROM employee E JOIN employee M ON E.manager_id = M.id JOIN roles ON E.role_id = roles.id`;
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
          const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?);`;
          const params = [data.first_name, data.last_name, data.role];

          const sqlEmployee = `SELECT employee.id, employee.first_name FROM employee;`;
          console.log(`---EMPLOYEES---`);

          db.query(sqlEmployee, (err, result) => {
            if (err) {
              throw err;
            } else {
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the manager?",
                    choices: showEmployees(result),
                  },
                ])
                .then((data) => {
                  params.push(data.manager);

                  db.query(sql, params, (err, results) => {
                    if (err) {
                      throw err;
                    } else {
                      console.table(results);
                      return viewEmployee();
                    }
                  });
                });
            }
          });
        });
    }
  });
};

const updateEmployee = function () {
  const sql = `SELECT E.id, E.first_name, E.last_name, roles.title, roles.salary, M.first_name AS manager FROM employee E JOIN employee M ON E.manager_id = M.id JOIN roles ON E.role_id = roles.id`;
  console.log(`---EMPLOYEES---`);

  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.table(result);
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Who would you like to update?",
            choices: showEmployees(result),
          },
        ])
        .then((data) => {
          const employee = data.employee;

          const sqlRole = `SELECT roles.id, roles.title FROM roles;`;

          db.query(sqlRole, (err, res) => {
            if (err) {
              throw err;
            } else {
              console.table(res);
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "role",
                    message: "Select thier new role",
                    choices: showRoles(res),
                  },
                ])
                .then((data) => {
                  const updateSQL = `UPDATE employee SET role_id = ${data.role} WHERE id = ${employee}`;

                  db.query(updateSQL, (err, results) => {
                    if (err) {
                      throw err;
                    } else {
                      console.table(results);
                      viewEmployee();
                    }
                  });
                });
            }
          });
        });
    }
  });
};

const employeesByManager = function () {
  const sql = `SELECT E.id, E.first_name, E.last_name, roles.title, roles.salary, M.first_name AS manager FROM employee E JOIN employee M ON E.manager_id = M.id JOIN roles ON E.role_id = roles.id`;
  console.log(`---EMPLOYEES---`);

  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.table(result);
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Who would you like to update?",
            choices: showEmployees(result),
          },
        ])
        .then((data) => {
          const employee = data.employee;

          const sqlManager = `SELECT E.id, E.first_name, E.last_name, M.first_name AS manager FROM employee E JOIN employee M ON E.manager_id = M.id`;

          db.query(sqlManager, (err, res) => {
            if (err) {
              throw err;
            } else {
              console.table(res);
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "role",
                    message: "Select thier new manager",
                    choices: showManager(res),
                  },
                ])
                .then((data) => {
                  const updateSQL = `UPDATE employee SET manager_id = ${data.role} WHERE id = ${employee}`;

                  db.query(updateSQL, (err, results) => {
                    if (err) {
                      throw err;
                    } else {
                      console.table(results);
                      viewEmployee();
                    }
                  });
                });
            }
          });
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
          "employee by manager",
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
        updateEmployee();
      }
      if (data.test === "employee by manager") {
        employeesByManager();
      }
      if (data.test === "STOP") {
        return;
      }
    });
};

init();
// `SELECT E.id, E.first_name, E.last_name, M.first_name AS manager FROM employee E JOIN employee M ON E.manager_id = M.id;`
