const inquirer = require("inquirer");
let cTable = require("console.table");
const mysql = require("mysql12");

const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "cms_db"
});

/* Required database calls */


