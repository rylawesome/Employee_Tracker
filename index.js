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

async function viewEmployees() {
    const rows = await db.query("SELECT * FROM employee");
    console.table(rows);
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

async function getEmployeeId(fullName) {
    let employee = getFirstAndLastName(fullName);

    let query = 'SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?';
    let args=[employee[0], employee[1]];
    const rows = await db.query(query, args);
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

async function updateEmployeeRole(employeeInfo) {
    const roleId = await getRoleId(employeeInfo.role);
    const employee = getFirstAndLastName(employeeInfo.employeeName);

    const rows = await db.query('UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?', [roleId, employee[0], employee[1]]);
    console.log(`Employee ${employee[0]} ${employee[1]} now has role ${employeeInfo.role}`);
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
                  "View All Employees By Department(To Be Implemented!)",
                  "View All Employees By Manager(To Be Implemented!)",
                  "Add Employee",
                  "Remove Employee(To Be Implemented!)",
                  "Update Employee Role",
                  "Update Employee Manager(To Be Implemented)",
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
            console.log("added role");
            break;
        }

        case 'View All Roles' : {
            console.log("Roles Viewed");
            break;
        }

        case 'Add Department' : {
            console.log("Department Added");
            break;
        }

        case 'View All Departments' : {
            console.log("Departments Viewed");
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