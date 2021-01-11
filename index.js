const inquirer = require("inquirer");
let cTable = require("console.table");
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "cms_db"
});

db.connect(function(err) {
    if (err) throw err;
    main();
})

/* Required database calls */

/* End Database Calls */

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
            console.log("Viewed Employees");
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
            console.log("Added employee");
            break;
        }

        case 'Remove Employee(To Be Implemented!)' : {
            console.log("Not Yet Implemented!");
            break;
        }

        case 'Update Employee Role' : {
            console.log("Updated Employee Role");
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
            console.log("added deparmtent");
            break;
        }

        default:
            console.log(`App failure. Report following info: ${prompt.action}`);
    }
}
}