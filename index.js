const inquirer = require('inquirer');
const connection = require('./config/connection');
const EmployeeTracker = require('./lib/lib')

const emp = new EmployeeTracker(connection);

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
                
                case "Add a role": 
                    addRole();
                    break;

                case "Add an employee":
                    addEmployee();
                    break;

                case "Update an employee role":
                    updateEmployeeRole();
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
    emp.getDepartments()
        .then((rows) => {
            console.table(rows);
            menu();
        })
        .catch((err) => {
            console.error(err);
            menu();
        });
};

function viewAllRoles() {
    emp.getRoles()
        .then((rows) => {
            console.table(rows)
            menu();
        })
        .catch((err) => {
            console.error(err);
            menu();
        });
};

function viewAllEmployees() {
    emp.getEmployees()
        .then((rows) => {
            console.table(rows)
            menu();
        })
        .catch((err) => {
            console.error(err);
            menu();
        });
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
                console.error("Department name is not valid.");
                menu();

            } else {
                emp.addDepartment(answer.departmentName)
                .then(() => {
                    console.log(`${answer.departmentName} added successfully!` );
                    viewAllDepartments();
                }) 
                .catch((error) => {
                    console.error(error);
                    menu();
                });
            }
        })
};

function addRole() {

    emp.getDepartments()
        .then((departments) => {
            inquirer.prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'Enter the role name to add' 
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'Enter the role salary' 
                },
                {
                    name: 'department',
                    type: 'list',
                    choices: departments
                }
            ])
            .then((answers) => {
                if (!answers.title || !answers.salary) {
                    console.error("Valid values were not provided to add new role.");
                    menu();
                } else {
                    const selectedDepartment = departments.find(department => department.name === answers.department )
                    emp.addRole(answers.title, answers.salary, selectedDepartment.id)
                        .then(() => {
                            console.log(`Department ${answers.title} added.`);
                            emp.getRoles().then((rows) => {
                                viewAllRoles();
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                            menu();
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                menu();
            })   
        })
        .catch((error) => {
            console.error(`Failed to get departments: ${error}`);
            console.error(`Unable to add a new role.`);
            
        });    
}

function addEmployee() {

    inquirer
        .prompt([    
            {
                name: 'firstName',
                type: 'input',
                message: 'Enter employee first name' 
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Enter employee last name' 
            }
        ])
        .then((answers) => {
            if (!answers.firstName || !answers.lastName) {
                console.error(`First name and last name cant be empty.`)
                menu();
            } else {
                emp.getRoles()
                .then((roles) => {
                    const roleChoices = roles.map(({ id, title}) => ({name: title, value: id}))
                    inquirer.prompt(
                        {
                            name: 'rChoice',
                            message: "Select the employees role",
                            type: 'list',
                            choices: roleChoices
                        }
                    )
                    .then((selectedRole) => {
                        emp.getEmployees()
                            .then((employeeList) => {

                                const empList = employeeList.map(({id, first_name, last_name}) => ({
                                    name: `${first_name} ${last_name}`,
                                    value: id
                                }));

                                inquirer.prompt([
                                    {
                                        name: 'manager',
                                        type: 'list',
                                        message: "Select the employees manager",
                                        choices: empList
                                    }
                                ])
                                .then((selectedManager) => {
                                    emp.addEmployee(
                                        answers.firstName, answers.lastName, selectedRole.rChoice, selectedManager.manager
                                    ).then(() => {
                                        console.log(`Employee ${answers.firstName} added to database.`)
                                        viewAllEmployees();
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                    })
                                })
                                .catch((err) => {
                                    console.error(err);
                                })
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
            }
        });
}

function updateEmployeeRole() {
    emp.getEmployees().then((employees) => {
        const employeeList = employees.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name , value: id }))
        
        emp.getRoles().then((roles) => {
            const roleList = roles.map(({ id, title}) => ({name: title, value: id}))

            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Select employee to update role",
                    choices: employeeList
                },
                {
                    type: "list",
                    name: "role",
                    message: "Select new role",
                    choices: roleList
                }
            ])
            .then((answers) => {
                emp.updateEmployeeRole(answers.employee, answers.role).then((resp) => {
                    console.log(resp);
                    viewAllEmployees();
                })
                .catch((err) => {
                    console.error(err);
                })
            })
        })
        .catch((err) => {
            console.error(err);
        });
    });
}

menu();