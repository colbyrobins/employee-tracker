const inquirer = require('inquirer');
const connection = require('./config/connection');

function menu() {
    inquirer
        .prompt([
            {
                name: "choices",
                type: "list",
                message: "What would you like to do? (Use arrow keys)",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee", 
                    "Update an employee role",
                    "Quit"
                ]
            }
        ])
        .then((answer) => {
            switch (answer.choices) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                
                case "View all roles": 
                    viewAllRoles();
                    break;

                case "View all employees": 
                    viewAllEmployees();
                    break;
                
                case "Add a department":
                    addDepartment();
                    break;

                case "Quit": 
                    connection.end();
                    process.exit();
                
                default: 
                    menu();
            }
            
        })
        .catch((error) => {
            console.error(error);
        });
}

function viewAllDepartments() {
    let sql = 'SELECT id, name FROM department';
    connection.promise().query(sql)
        .then( ([row, fields]) => {
            console.table(row)
            menu();
        })
        .catch(console.error);
};

function viewAllRoles() {
    let sql = `SELECT role.id, role.title, role.salary, department.name as department_name
               FROM role
               INNER JOIN department ON role.department_id = department.id `;
    connection.promise().query(sql)
        .then(([row, fields]) => {
            console.table(row)
            menu();
        })
        .catch(console.error);
};

function viewAllEmployees() {
    let sql = `SELECT employee.id,
               employee.first_name,
               employee.last_name,
               role.title,
               department.name AS 'department',
               role.salary
               FROM employee, role, department
               WHERE department.id = role.department_id
               AND role.id = employee.role_id`;
    connection.promise().query(sql)
        .then(([row, fields]) => {
            console.table(row)
            menu();
        })
        .catch(console.error);
};

function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'departmentName',
                type: 'input',
                message: 'Enter the new department name'
            }
        ])
        .then((answer) => {
            if (!answer.departmentName) {
                console.error("Department name is not valid.")
            } else {
                let sql = `INSERT INTO department (name) VALUE (?)`
                connection.promise().query(sql, answer.departmentName)
                    .then(([row, fields]) => {
                        console.log(`${answer.departmentName} added successfully!` );
                        viewAllDepartments();
                    }) 
                    .catch(console.error);
            }
            menu();
        })
};

menu();