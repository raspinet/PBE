CREATE DATABASE cdr;

USE cdr;

-- STUDENTS
CREATE TABLE students (name VARCHAR(50), student_id VARCHAR(8));
INSERT INTO students VALUES
('Jiajun Zheng', '1111'),
('Huankang Xu','2222'),
('Sebastian Roman', '71F4A91C'),
('Pau Constans', '4444'),


CREATE TABLE tasks (date DATE NOT NULL,subject VARCHAR(10) NOT NULL,name VARCHAR(20) NOT NULL,student_id VARCHAR(8) NOT NULL);
INSERT INTO tasks VALUES
('2024-11-25', 'PBE', 'CDR', '1111'),
('2024-11-25', 'PBE', 'CDR', '2222'),
('2024-11-25', 'PBE', 'CDR ', '71F4A91C'),
('2024-11-25', 'PBE', 'CDR', '4444'),
('2025-01-17', 'TD', 'final', '1111'),
('2025-01-17', 'TD', 'final', '2222'),
('2025-01-17', 'TD', 'final', '71F4A91C'),
('2025-01-17', 'TD', 'final', '4444'),
('2025-01-7', 'RP', 'final', '1111'),
('2025-01-7', 'RP', 'final', '2222'),
('2025-01-7', 'RP', 'final', '71F4A91C'),
('2025-01-7', 'RP', 'final', '4444'),
('2025-01-09', 'PSVAC', 'Final', '1111'),
('2025-01-09', 'PSVAC', 'Final', '2222'),
('2025-01-09', 'PSVAC', 'Final', '71F4A91C'),
('2025-01-09', 'PSVAC', 'Final', '4444'),


CREATE TABLE timetables (day VARCHAR(3) NOT NULL, hour VARCHAR(8) NOT NULL, subject VARCHAR(10) NOT NULL, room VARCHAR(8) NOT NULL, student_id VARCHAR(8) NOT NULL);
INSERT INTO timetables VALUES
('1', '10:00:00', 'RP', 'A4105', '1111'),
('1', '10:00:00', 'RP', 'A4105', '2222'),
('1', '10:00:00', 'RP', 'A4105', '71F4A91C'),
('1', '10:00:00', 'RP', 'A4105', '4444'),
('2', '08:00:00', 'PSAVC', 'A4105', '1111'),
('2', '08:00:00', 'PSAVC', 'A4105', '2222'),
('2', '08:00:00', 'PSAVC', 'A4105', '71F4A91C'),
('2', '08:00:00', 'PSAVC', 'A4105', '4444'),
('2', '11:00:00', 'TD', 'A4105', '1111'),
('2', '11:00:00', 'TD', 'A4105', '2222'),
('2', '11:00:00', 'TD', 'A4105', '71F4A91C'),
('2', '11:00:00', 'TD', 'A4105', '4444'),
('3', '08:00:00', 'PBE', 'A4105', '1111'),
('3', '08:00:00', 'PBE', 'A4105', '2222'),
('3', '08:00:00', 'PBE', 'A4105', '71F4A91C'),
('3', '08:00:00', 'PBE', 'A4105', '4444'),
('4', '08:00:00', 'PBE', 'A4105', '1111'),
('4', '08:00:00', 'PBE', 'A4105', '2222'),
('4', '08:00:00', 'PBE', 'A4105', '71F4A91C'),
('4', '08:00:00', 'PBE', 'A4105', '4444'),
('4', '10:00:00', 'RP', 'A4105', '1111'),
('4', '10:00:00', 'RP', 'A4105', '2222'),
('4', '10:00:00', 'RP', 'A4105', '71F4A91C'),
('4', '10:00:00', 'RP', 'A4105', '4444'),
('5', '10:00:00', 'PSAVC', 'A4105', '1111'),
('5', '10:00:00', 'PSAVC', 'A4105', '2222'),
('5', '10:00:00', 'PSAVC', 'A4105', '71F4A91C'),
('5', '10:00:00', 'PSAVC', 'A4105', '4444'),
('5', '12:00:00', 'TD', 'A4105', '1111'),
('5', '12:00:00', 'TD', 'A4105', '2222'),
('5', '12:00:00', 'TD', 'A4105', '71F4A91C'),
('5', '12:00:00', 'TD', 'A4105', '4444'),


CREATE TABLE marks (subject VARCHAR(10) NOT NULL, name VARCHAR(20) NOT NULL, mark FLOAT(4) NOT NULL, student_id VARCHAR(8) NOT NULL);
INSERT INTO marks VALUES
('PBE', 'Puzzle 1', 6, '1111'),
('PBE', 'Puzzle 1', 7,'2222'),
('PBE', 'Puzzle 1', 6, '71F4A91C'),
('PBE', 'Puzzle 1', 4, '4444'),
('TD', 'Examen parcial', 1, '1111'),
('TD', 'Examen parcial', 0, '2222'),
('TD', 'Examen parcial', 1, '71F4A91C'),
('TD', 'Examen parcial', 1, '4444'),
('RP', 'Examen parcial', 3, '1111'),
('RP', 'Examen parcial', 0.7, '2222'),
('RP', 'Examen parcial', 3, '71F4A91C'),
('RP', 'Examen parcial', 3, '4444'),
('PSAVC', 'Examen parcial', 5.1, '1111'),
('PSAVC', 'Examen parcial', 4.6, '2222'),
('PSAVC', 'Examen parcial', 5.1, '71F4A91C'),
('PSAVC', 'Examen parcial', 5.1, '4444'),
