DELETE FROM department;
DELETE FROM roleType;
DELETE FROM employee;

INSERT INTO department (name)
VALUES  ('Sales'),
        ('Marketing'),
        ('Engineering'),
        ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES  ('Sales Representative', 30000, 1),
        ('Marketing Specialist', 55000, 2),
        ('Software Engineer', 100000, 3),
        ('Finance Analyst', 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Albert', 'McComb', 1, NULL),
        ('Jordan', 'Dark', 2, NULL),
        ('Jim', 'Gordon', 3, 1),
        ('Amy', 'Brown', 4, 2),
        ('John', 'Don', 2, 1),
        ('Nick', 'Smith', 3, 2),
        ('Diana', 'Jones', 2, 2);