const inquirer = require("inquirer");
let cTable = require("console.table");
let Database = require("./sync_db");

const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "cms_db"
});

// Required database calls

//Following three view employees, roles, and department

async function viewEmployees() {
    const rows = await db.query("SELECT * FROM employee");
    console.table(rows);
    }

async function viewRoles() {
    const rows = await db.query("SELECT * FROM role");
    console.table(rows);
    return rows;
}

async function viewDepartment() {
    const rows = await db.query("SELECT * FROM department");
    console.table(rows);
    return rows;
}

// Return array with [first_name, last_name]

function getFirstAndLastName( fullName ) {
    let employee = fullName.split(" ");
    if(employee.length == 2) {
        return employee;
    }

    const last_name = employee[employee.length-1];
    const first_name = employee[employee.length-2];
    return [first_name, last_name];
}

async function getRoleId(roleName) {
    const rows = await db.query("SELECT * FROM role WHERE role.title=?", roleName);
    return rows[0].id;
}

// Builds all employeeNames array

async function getEmployeeNames() {
    const rows = await db.query("SELECT * FROM employee");
    let employeeNames = [];
    for(const employee of rows) {
        employeeNames.push(employee.first_name + " " + employee.last_name);
    }
    return employeeNames;
}

// Builds managerNames array

async function getManagerNames() {
    const rows = await db.query("SELECT * FROM employee WHERE manager_id IS NULL");
    let managerNames = [];
    for(const employee of rows) {
        managerNames.push(employee.first_name + " " + employee.last_name);
    }
    return managerNames;
}

// Builds roles array

async function getRoles() {
    const rows = await db.query("SELECT title FROM role");

    let roles = [];
    for(const row of rows) {
        roles.push(row.title);
    }

    return roles;
}

// Uses above built arrays to give user roles/managers list

async function addEmployeeInfo() {
    const managers = await getManagerNames();
    const roles = await getRoles();
    return inquirer
        .prompt([
            {
                type: "input",
                name: "first_name",
                message: "First name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "Last name?"
            },
            {
                type: "list",
                message: "Employee's role?",
                name: "role",
                choices: [
                    ...roles
                ]
            },
            {
                type: "list",
                message: "Employee's manager?",
                name: "manager",
                choices: [
                    ...managers
                ]
            }
        ])
}

//returns employee id attached w/ first & last name

async function getEmployeeId(fullName) {
    let employee = getFirstAndLastName(fullName);

    const rows = await db.query('SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?', [employee[0], employee[1]]);
    return rows[0].id;
}

async function addEmployee(employeeInfo) {
    let roleId = await getRoleId(employeeInfo.role);
    let managerId = await getEmployeeId(employeeInfo.manager);

    const rows = await db.query("INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [employeeInfo.first_name, employeeInfo.last_name, roleId, managerId]);
    console.log(`Added employee ${employeeInfo.first_name} ${employeeInfo.last_name}.`);
}

//Gather info and update role

async function updateEmployeeRoleInfo() {
    const employees = await getEmployeeNames();
    const roles = await getRoles();
    return inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee to update?",
                name: "employeeName",
                choices: [
                    ...employees
                ]
            },
            {
                type: "list",
                message: "Employee's new role?",
                name: "role",
                choices: [
                    ...roles
                ]
            }
        ])
}

//Retrieves/returns all department names

async function getDepartmentNames() {
    const rows = await db.query("SELECT name FROM department");

    let departments = [];
    for(const row of rows) {
        departments.push(row.name);
    }

    return departments;
}

// Collects new Role info

async function getRoleInfo() {
    const departments = await getDepartmentNames();
    return inquirer
    .prompt([
        {
            type: "input",
            message: "Title of new role?",
            name: "roleName"
        },
        {
            type: "input",
            message: "Salary of new role?",
            name: "salary"
        },
        {
            type: "list",
            message: "Department that uses this role?",
            name: "departmentName",
            choices: [
                ...departments
            ]
        }
    ])
}

// Updates Employee Roles

async function updateEmployeeRole(employeeInfo) {
    const roleId = await getRoleId(employeeInfo.role);
    const employee = getFirstAndLastName(employeeInfo.employeeName);

    const rows = await db.query('UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?', [roleId, employee[0], employee[1]]);
    console.log(`Employee ${employee[0]} ${employee[1]} now has role ${employeeInfo.role}`);
}

// Finds specific department

async function getDepartmentId(departmentName) {
    const rows = await db.query("SELECT * FROM department WHERE department.name=?", [departmentName]);
    return rows[0].id;
}

// Creates new Role

async function addRole(roleInfo) {
    const departmentId = await getDepartmentId(roleInfo.departmentName);
    const salary = roleInfo.salary;
    const title = roleInfo.roleName;
    const rows = await db.query('INSERT into role (title, salary, department_id) VALUES (?,?,?)', [title, salary, departmentId]);
    console.log(`Added role ${title}`);
}

// Simple, gives name to new department

async function getDepartment() {
    return inquirer
    .prompt([
        {
            type: "input",
            message: "What is the name of the new department?",
            name: "departmentName"
        }
    ])
}

async function addDepartment(departmentInfo) {
    const departmentName = departmentInfo.departmentName;
    const rows = await db.query('INSERT into department (name) VALUES (?)', [departmentName]);
    console.log(`Added department ${departmentName}`);
}


//Start building user prompts


async function mainPrompt() {
    return inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "action",
                choices: [
                  "View All Employees",
                  "!!!View All Employees By Department!!!(To Be Implemented!)",
                  "!!!View All Employees By Manager!!!(To Be Implemented!)",
                  "Add Employee",
                  "!!!Remove Employee!!!(To Be Implemented!)",
                  "Update Employee Role",
                  "!!!Update Employee Manager!!!(To Be Implemented)",
                  "Add Role",
                  "View All Roles",
                  "Add Department",
                  "View All Departments",
                  "Exit"
                ]
            }
        ])
}

async function main() {
    let exit = false

    while(!exit) {
    const prompt = await mainPrompt();
    switch(prompt.action) {
        case 'View All Employees' : {
            console.log("Getting employees...");
            await viewEmployees();
            break;
        }

        case 'View All Employees By Department(To Be Implemented!)' : {
            console.log("Not Yet Implemented!");
            break;
        }

        case 'View All Employees By Manager(To Be Implemented!)' : {
            console.log("Not Yet Implemented!");
            break;
        }

        case 'Add Employee' : {
            const employee = await addEmployeeInfo();
            console.log(employee);
            await addEmployee(employee);
            break;
        }

        case 'Remove Employee(To Be Implemented!)' : {
            console.log("Not Yet Implemented!");
            break;
        }

        case 'Update Employee Role' : {
            const employee = await updateEmployeeRoleInfo();
            await updateEmployeeRole(employee);
            break;
        }

        case 'Update Employee Manager(To Be Implemented)' : {
            console.log("Not Yet Implemented!");
            break;
        }

        case 'Add Role' : {
            const newRole = await getRoleInfo();
            await addRole(newRole);
            break;
        }

        case 'View All Roles' : {
            await viewRoles();
            break;
        }

        case 'Add Department' : {
            const departmentName = await getDepartment();
            await addDepartment(departmentName);
            break;
        }

        case 'View All Departments' : {
            await viewDepartment();
            break;
        }

        case 'Exit' : {
            console.log("Exiting...")
            exit = true;
            if(exit === true) {
                console.log("Successful Exit")
                return;
            }
            else {
                console.log("Exit failed! App Error. Press CTRL+C to Exit Manually")
                break;
            }
        }

        default:
            console.log(`App failure. Report following info: ${prompt.action}`);
    }
}
}

main();