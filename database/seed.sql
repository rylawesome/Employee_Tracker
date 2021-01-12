USE cms_db;

INSERT into department (name) VALUES ("Sales");
INSERT into department (name) VALUES ("IT");

USE cms_db;

INSERT into role (title, salary, department_id) VALUES ("Bean Manager", 100000, 1);
INSERT into role (title, salary, department_id) VALUES ("Bean Salesman", 50000, 1);
INSERT into role (title, salary, department_id) VALUES ("IT Manager", 85000, 2);

INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Jack", "White", 3, null);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Jack", "Brown", 3, null);