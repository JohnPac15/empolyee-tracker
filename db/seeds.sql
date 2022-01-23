INSERT INTO department(id, name)
VALUES
(1,'Enginerring'),
(2,'Finance'),
(3,'Legal'),
(4,'Sales');

INSERT INTO roles(id, title, salary, department_id)
VALUES
(1,'lead Engineer', 100000, 1),
(2,'Banker', 180000,2),
(3, 'Lawyer', 500000, 3),
(4, 'Front man', 80000, 4);

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES
(1, 'John', 'Pacini', 1, NULL),
(2,'Ethan', 'Rugh', 2,1),
(3, 'Tye', 'Macon', 3, 2),
(4, 'Reid', 'Harton', 4,2);