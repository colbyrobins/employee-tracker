

class EmployeeTracker {
    constructor(connection) {
        this.conn = connection;
    }

    executeQuery(query, values = []) {
        return new Promise((resolve, reject) => {
            this.conn.query(query, values, (error, results) => {
                if (error) {
                    reject(`Error executing query: ${query}. ${error}`);
                } else {
                    resolve(results);
                }
            });
        });
    }

    addRole(title, salary, department) {
        const sql = `INSERT INTO role (title, salary, department_id)
                     VALUE (?, ?, ?)`
        return this.executeQuery(sql, [title, salary, department])
    }
    getRoles() {
        const sql = `SELECT role.id, role.title, role.salary, department.name AS department 
                     FROM role
                     INNER JOIN department ON role.department_id = department.id`;
        return this.executeQuery(sql);
    }

    addDepartment(name) {
        const sql = `INSERT INTO department (name) VALUE (?)`
        return this.executeQuery(sql, name)
    }

    getDepartments() {
        const sql = "SELECT * FROM department";
        return this.executeQuery(sql);
    }

    addEmployee(firstName, lastName, roleId, managerId) {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                     VALUES (?, ?, ?, ?)`
        return this.executeQuery(sql, [firstName, lastName, roleId, managerId])
    }
    
    getEmployees() {
        const sql = `SELECT e.id,
               e.first_name,
               e.last_name,
               role.title,
               department.name AS 'department',
               role.salary,
               CONCAT(e1.first_name, ' ', e1.last_name) AS 'Manager Name'
               FROM employee e
               JOIN role ON e.role_id = role.id
               JOIN department ON role.department_id = department.id
               LEFT JOIN employee e1 ON e.manager_id = e1.id`;
            //    FROM employee, role, department
            //    WHERE department.id = role.department_id
            //    AND role.id = employee.role_id`;
        return this.executeQuery(sql);
    }

    updateEmployeeRole(employeeId, roleId) {
        const sql = `UPDATE employee SET role_id = (?) WHERE id = (?)`
        return this.executeQuery(sql, [roleId, employeeId]);
    }
}


module.exports = EmployeeTracker