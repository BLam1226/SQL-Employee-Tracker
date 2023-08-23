// Import the connection from connection.js
const connection = require("./connection");

// Function to retrieve all departments
async function viewDepartments() {
  try {
    const [rows] = await connection.execute("SELECT * FROM department");
    return rows;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
}

// Function to retrieve all roles
async function viewRoles() {
  try {
    const [rows] = await connection.execute("SELECT * FROM roles");
    return rows;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
}

// Function to retrieve all employees
async function viewEmployees() {
  try {
    const [rows] = await connection.execute(`
        SELECT
        employees.id,
        employees.first_name,
        employees.last_name,
        roles.title,
        department.name AS department,
        roles.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employees
        INNER JOIN roles ON employees.role_id = roles.id
        INNER JOIN department ON roles.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employees.manager_id; `);
    return rows;
  } catch (error) {
    console.error("error fetching employees:", error);
    throw error;
  }
}

// Function to add a department
async function addDepartment(name) {
  try {
    await connection.execute("INSERT INTO department (name) VALUES (?)", [
      name,
    ]);
    console.log(`Department "${name}" added successfully.`);
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
}

// Function to add a role
async function addRole(title, salary, departmentId) {
  try {
    await connection.execute(
      "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
      [title, salary, departmentId]
    );
    console.log(`Role "${title}" added successfully.`);
  } catch (error) {
    console.error("Error adding role:", error);
    throw error;
  }
}

// Function to add an employee
async function addEmployee(firstName, lastName, roleId, managerId) {
  try {
    await connection.execute(
      "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
      [firstName, lastName, roleId, managerId]
    );
    console.log(`Employee "${firstName} ${lastName}" added successfully.`);
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
}

// Function to update an employee's role
async function updateEmployeeRole(employeeId, newRoleId) {
  try {
    await connection.execute("UPDATE employees SET role_id = ? WHERE id = ?", [
      newRoleId,
      employeeId,
    ]);
    console.log(`Employee role updated successfully.`);
  } catch (error) {
    console.error("Error updating employee role");
    throw error;
  }
}

// Function to update an employee's manager
async function updateEmployeeManager(employeeId, newManagerId) {
  try {
    await connection.execute(
      "UPDATE employees SET manager_id = ? WHERE id = ?",
      [newManagerId, employeeId]
    );
    console.log(`Employee manager updated successfully.`);
  } catch (error) {
    console.error("Error updating employee manager");
    throw error;
  }
}

// Function to retrieve all employees with a given manager
async function getEmployeesByManager(managerId) {
  try {
    const [rows] = await connection.execute(
      `SELECT * FROM employees WHERE manager_id = ?`,
      [managerId]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching employees by manager:", error);
    throw error;
  }
}

// Function to retrieve all employees with a given department
async function getEmployeesByDepartment(departmentId) {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM employees WHERE role_id IN (SELECT id FROM role WHERE department_id = ?)",
      [departmentId]
    );
    return rows;
  } catch (error) {
    console.error("Error retrieving employees by department:", error);
    throw error;
  }
}

// Function to delete a department
async function deleteDepartment(departmentId) {
  try {
    await connection.execute("DELETE FROM department WHERE id = ?", [
      departmentId,
    ]);
    console.log(`Department deleted successfully.`);
  } catch (error) {
    console.error("Error deleting department:", error);
    throw error;
  }
}

// Function to delete a role
async function deleteRole(roleId) {
  try {
    await connection.execute("DELETE FROM roles WHERE id = ?", [roleId]);
    console.log(`Role deleted successfully.`);
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
}

// Function to delete an employee
async function deleteEmployee(employeeId) {
  try {
    await connection.execute("DELETE FROM employees WHERE id = ?", [employeeId]);
    console.log(`Employee deleted successfully.`);
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
}

// Function to calculate the total utilized budget of a department
async function getDepartmentBudget(departmentId) {
  try {
    const [rows] = await connection.execute(
      "SELECT SUM(salary) AS total_budget FROM roles WHERE department_id = ?",
      [departmentId]
    );
    return rows[0].total_budget;
  } catch (error) {
    console.error("Error calculating department budget:", error);
    throw error;
  }
}

module.exports = {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  getEmployeesByManager,
  getEmployeesByDepartment,
  deleteDepartment,
  deleteRole,
  deleteEmployee,
  getDepartmentBudget,
};
