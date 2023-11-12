INSERT INTO department (name)
VALUES ("Finance"),
       ("Sales"),
       ("Engineering"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Account Manager", 160000, 1),
       ("Accountant", 125000, 1),
       ("Sales Lead", 100000, 2),
       ("Salesperson", 80000, 2),
       ("Lead Engineer", 150000, 3),
       ("Software Engineer", 120000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "John", "Doe", 2, NULL),
       (2, "Mike", "Chan", 2, 1),
       (3, "Ashley", "Rodriguez", 3, NULL),
       (4, "Kevin", "Tupik", 3, 3),
       (5, "Kunal", "Singh", 1, NULL),
       (6, "Malia", "Brown", 1, 5),
       (7, "Sarah", "Lourd", 4, NULL),
       (8, "Tom", "Allen", 4, 7);