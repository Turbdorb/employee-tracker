const db = require('../config/connection');
const inquirer = require('inquirer');

const startMenu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'startScreen',
                choices: [
                    'View All Employees',
                    'Add Employee', 
                    'Update Employee Role', 
                    'View All Roles', 
                    'Add Role', 
                    'View All Departments', 
                    'Add Department',
                    'Quit'
                ]
            }
        ])
        .then((answer) => {
            choice(answer.startScreen); 
        })
};

const viewAllDepartments = () => {
    db.promise().query('SELECT id AS Department_id, name AS Department_Name FROM department')
    .then((rows) => { 
        console.table(rows[0]); 
    })
    .then(() => startMenu());
};

const addEmployee = (first_name, last_name, role, manager) => {
    db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [first_name, last_name, role, manager])
    .then(() => console.log(`${first_name} ${last_name} was successfully added to employees!`))
    .then(() => startMenu());
};

const updateEmployeeRole = (employee, newRole) => {
    db.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRole, employee], (err, results) => { 
        if(err) {
            console.log(err);
        } else {
            console.log(`Role was successfully updated!`);
            return startMenu();
        };
    });
};



const choice = (str) => {
    let managerList;
    let roleList;
    switch(str) {
        case 'View all departments':
            return viewAllDepartments();
        case 'View all roles': 
            return viewAllRoles();
        case 'View all employees':
            return viewAllEmployees();
        case 'Add a department':
            inquirer
                .prompt([
                    {
                        type: 'input',
                        message: 'Enter the name of the department you would like to add:',
                        name: 'departmentName'
                    }
                ])
                .then((answer) => {
                    return addDepartment(answer.departmentName);
                });
            break;
        case 'Add a role': 
            db.promise().query('SELECT * FROM department')
            .then((rows, fields) => {
                return rows[0].map((dept) => ({
                    name: `${dept.name}`,
                    value: `${dept.id}`
                }));
            })
            .then((departmentList)=> {
                inquirer
                .prompt([
                    {
                        type: 'input',
                        message: 'Enter the role you would like to add:',
                        name: 'title'
                    },
                    {
                        type: 'input',
                        message: 'Enter the salary of this role:',
                        name: 'salary'
                    },
                    {
                        type: 'list',
                        message: 'Select what department this role belongs to:',
                        name: 'department',
                        choices: departmentList
                    }
                ])
                .then((answer) => {
                    return addRole(answer.title, answer.salary, answer.department);
                });
            });
            break;
        case 'Add an employee':
            db.promise().query('SELECT * FROM employee')
            .then((rows, fields) => {
                managerList = rows[0].map((manager) => ({
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: `${manager.id}`
                }));
            })
            .then(() => {
                db.promise().query('SELECT * FROM role')
                .then((rows, fields) => {
                    roleList = rows[0].map((role) => ({
                        name: `${role.title}`,
                        value: `${role.id}`
                    }));
                })
                .then(() => {
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                message: 'What is the new employee\'s first name?',
                                name: 'firstName'
                            },
                            {
                                type: 'input',
                                message: 'What is the new employee\'s last name?',
                                name: 'lastName'
                            },
                            {
                                type: 'list',
                                message: 'Choose the role for the new employee:',
                                name: 'role',
                                choices: roleList
                            },
                            {
                                type: 'list',
                                message: 'Choose the manager for the new employee:',
                                name: 'manager',
                                choices: managerList
                            }
                        ])
                        .then((answer) => {
                            return addEmployee(answer.firstName, answer.lastName, answer.role, answer.manager);
                        });
                })
            }); 
            break;
        case 'Update an employee role':
            db.promise().query('SELECT * FROM employee')
            .then((rows, fields) => {
                managerList = rows[0].map((manager) => ({
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: `${manager.id}`
                }));
            })
            .then(() => {
                db.promise().query('SELECT * FROM role')
                .then((rows, fields) => {
                    roleList = rows[0].map((role) => ({
                        name: `${role.title}`,
                        value: `${role.id}`
                    }));
                })
                .then(() => {    
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                message: 'What employee do you want to update?',
                                name: 'employee',
                                choices: managerList
                            },
                            {
                                type: 'list',
                                message: 'Choose the new role for the employee:',
                                name: 'role',
                                choices: roleList
                            },
                        ])
                        .then((answer) => {
                            return updateEmployeeRole(answer.employee, answer.role);
                        });
                    });
            });
            break;
        case 'View department\'s utilized budget':
            return viewBudget();
    }
};

module.exports = { mainMenu };