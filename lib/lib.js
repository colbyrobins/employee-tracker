

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
        const sql = "SELECT * FROM role";
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

    getManagers(roleId) {
        const sql = `SELECT * FROM employees 
        WHERE role_id = ?`
        return this.executeQuery(sql, roleId);
    }
    
    getEmployees() {
        const sql = `SELECT employee.id,
               employee.first_name,
               employee.last_name,
               role.title,
               department.name AS 'department',
               role.salary
               FROM employee, role, department
               WHERE department.id = role.department_id
               AND role.id = employee.role_id`;
        return this.executeQuery(sql);
    }
}


module.exports = EmployeeTracker