-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 23, 2026 at 04:26 PM
-- Server version: 10.11.19-MariaDB
-- PHP Version: 8.5.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_updated`
--

-- --------------------------------------------------------

--
-- Table structure for table `facility`
--

CREATE TABLE `facility` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `capacity` int(11) NOT NULL,
  `open_time` time NOT NULL,
  `close_time` time NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facility`
--

INSERT INTO `facility` (`id`, `name`, `capacity`, `open_time`, `close_time`, `is_active`) VALUES
(1, 'Gymnasium', 1500, '07:00:00', '21:00:00', 1),
(2, 'Auditorium', 800, '07:00:00', '21:00:00', 1),
(3, 'Theater', 200, '07:00:00', '21:00:00', 1),
(4, 'AVR 1', 60, '07:00:00', '20:00:00', 1),
(5, 'Covered Court', 2000, '07:00:00', '21:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `requester_accounts`
--

CREATE TABLE `requester_accounts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requester_accounts`
--

INSERT INTO `requester_accounts` (`id`, `name`, `email`, `password_hash`, `created_at`) VALUES
(1, 'kacey', 'sangbaank@gmail.com', '$2y$10$V64PggbwTmb0QaNKQ54wIOrrBgoTkncMsmJ78HPZcc/nt8y4zNdju', '2026-11-19 20:10:19');

-- --------------------------------------------------------

--
-- Table structure for table `sarf`
--

CREATE TABLE `sarf` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `control_number` varchar(20) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `reject_reason` text DEFAULT NULL,
  `scan_path` varchar(255) DEFAULT NULL,
  `decided_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `requester_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sarf`
--

INSERT INTO `sarf` (`id`, `admin_id`, `control_number`, `status`, `reject_reason`, `scan_path`, `decided_at`, `created_at`, `requester_id`) VALUES
(1, NULL, '2026-0142', 'approved', NULL, NULL, '2026-11-19 23:22:26', '2026-11-12 09:15:00', NULL),
(2, NULL, '2026-0145', 'approved', NULL, NULL, '2026-11-21 23:54:54', '2026-11-13 10:00:00', NULL),
(3, NULL, '2026-0147', 'approved', NULL, NULL, '2026-11-21 23:52:22', '2026-11-14 08:30:00', NULL),
(4, NULL, '2026-0150', 'rejected', 'hey', NULL, '2026-11-19 23:43:42', '2026-11-15 13:20:00', NULL),
(5, 1, '2026-0139', 'approved', NULL, NULL, '2026-11-16 10:20:00', '2026-11-10 09:00:00', NULL),
(6, 1, '2026-0136', 'approved', NULL, NULL, '2026-11-15 14:05:00', '2026-11-09 11:00:00', NULL),
(7, 1, '2026-0143', 'approved', NULL, NULL, '2026-11-14 09:40:00', '2026-11-11 15:00:00', NULL),
(8, 1, '2026-0128', 'rejected', 'Missing Dean signature on the SARF.', NULL, '2026-11-12 11:00:00', '2026-11-08 14:00:00', NULL),
(58, NULL, 'SARF-2026-237807', 'rejected', 'hello', NULL, '2026-11-19 23:25:52', '2026-11-19 20:48:41', 1),
(59, NULL, 'SARF-2026-366188', 'rejected', 'hehe', NULL, '2026-11-20 01:34:04', '2026-11-20 00:38:03', 1),
(60, NULL, 'SARF-2026-686150', 'approved', NULL, NULL, '2026-11-22 00:08:21', '2026-11-22 00:08:10', 1),
(61, NULL, 'SARF-2026-654890', 'approved', NULL, NULL, '2026-11-22 00:13:57', '2026-11-22 00:13:49', 1),
(62, NULL, 'SARF-2026-357371', 'approved', NULL, NULL, '2026-11-22 00:26:37', '2026-11-22 00:19:21', 1),
(63, 1, 'SARF-2026-549305', 'approved', NULL, NULL, '2026-11-22 00:40:55', '2026-11-22 00:31:35', 1),
(64, 1, 'SARF-2026-922654', 'approved', NULL, NULL, '2026-11-22 01:00:55', '2026-11-22 00:52:05', 1),
(76, 1, 'SARF-2026-309961', 'rejected', 'asd', NULL, '2026-11-22 22:44:51', '2026-11-22 22:44:27', 1),
(79, 1, 'SARF-2026-734296', 'approved', NULL, NULL, '2026-11-22 23:36:23', '2026-11-22 23:23:50', 1),
(80, 1, 'SARF-2026-383211', 'approved', NULL, NULL, '2026-11-22 23:36:12', '2026-11-22 23:35:43', 1),
(81, 1, 'SARF-2026-526403', 'rejected', 'asd', NULL, '2026-11-22 23:37:25', '2026-11-22 23:37:10', 1),
(82, 1, 'SARF-2026-703789', 'approved', NULL, NULL, '2026-11-23 01:37:51', '2026-11-23 01:29:11', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sarf_req`
--

CREATE TABLE `sarf_req` (
  `id` int(11) NOT NULL,
  `sarf_id` int(11) NOT NULL,
  `facility_id` int(11) NOT NULL,
  `type_of_activity` enum('Academic','Non-Academic','College/Institutional') NOT NULL,
  `name_of_organizer_office_college` varchar(150) NOT NULL,
  `name_of_program` varchar(200) NOT NULL,
  `nature_of_activity` varchar(150) NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `participants_type` varchar(255) DEFAULT NULL,
  `est_total_participants` int(11) NOT NULL,
  `in_charge_name` varchar(100) NOT NULL,
  `in_charge_designation` varchar(100) NOT NULL,
  `in_charge_contact` varchar(30) NOT NULL,
  `in_charge_email` varchar(100) NOT NULL,
  `source_of_budget` varchar(150) DEFAULT NULL,
  `estimated_total_budget` decimal(12,2) DEFAULT NULL,
  `form_data` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sarf_req`
--

INSERT INTO `sarf_req` (`id`, `sarf_id`, `facility_id`, `type_of_activity`, `name_of_organizer_office_college`, `name_of_program`, `nature_of_activity`, `start_datetime`, `end_datetime`, `participants_type`, `est_total_participants`, `in_charge_name`, `in_charge_designation`, `in_charge_contact`, `in_charge_email`, `source_of_budget`, `estimated_total_budget`, `form_data`) VALUES
(1, 1, 1, 'Academic', 'Student Council', 'Leadership Summit', 'Leadership seminar', '2026-12-05 13:00:00', '2026-12-05 17:00:00', '', 300, 'Maria Santos', 'President', '0917 123 4567', 'maria.santos@example.edu', 'Student Council fund', 15000.00, NULL),
(4, 4, 4, 'Academic', 'Engineering Society', 'Robotics Workshop', 'Workshop', '2026-12-12 09:00:00', '2026-12-12 12:00:00', '', 40, 'Jomar Dizon', 'President', '0917 456 7890', 'jomar.dizon@example.edu', 'Org fund', 5000.00, NULL),
(6, 6, 2, 'Academic', 'College of Nursing', 'Health Seminar', 'Seminar', '2026-12-03 09:00:00', '2026-12-03 12:00:00', '', 200, 'Ana Villanueva', 'Coordinator', '0917 567 8901', 'ana.villanueva@example.edu', NULL, NULL, NULL),
(7, 7, 4, 'Academic', 'Computer Society', 'Coding Bootcamp', 'Bootcamp', '2026-12-12 10:00:00', '2026-12-12 14:00:00', '', 50, 'Kevin Lim', 'President', '0917 678 9012', 'kevin.lim@example.edu', 'Sponsorship', 12000.00, NULL),
(58, 58, 2, 'Academic', 'CITCS', 'Intramurals', 'Boxing', '2026-11-23 08:30:00', '2026-11-23 09:00:00', '', 123, 'Kacey Sangbaan', 'Di ko alam', '0912229292', 'malakititiko@gmail.com', 'bulsa ni mama ko', 50000.00, '{\"facilityId\":\"2\",\"participants\":[\"members\\/office staff only\",\"with other UC students\\/employees\"],\"checklist\":[],\"bmo\":[],\"lmo\":[],\"itss\":[],\"admin\":[],\"charges\":[],\"college\":\"Information Technology\",\"activityType\":\"Academic\",\"organization\":\"CITCS\",\"title\":\"Intramurals\",\"nature\":\"Boxing\",\"start\":\"2026-11-23T08:30\",\"end\":\"2026-11-23T09:00\",\"participantsTotal\":\"123\",\"budgetSource\":\"bulsa ni mama ko\",\"budget\":\"50000\",\"personName\":\"Kacey Sangbaan\",\"personDesignation\":\"Di ko alam\",\"personContact\":\"0912229292\",\"personEmail\":\"malakititiko@gmail.com\",\"presidentDate\":\"2026-11-19\",\"adviserNotedDate\":\"2026-11-19\",\"deanDate\":\"2026-11-19\",\"vpAcadDate\":\"2026-11-19\",\"venueReservedDate\":\"2026-11-19\",\"adviserDate\":\"2026-11-19\"}'),
(59, 59, 1, 'Academic', 'CITCS', 'CITCS week', 'Event', '2026-11-20 08:00:00', '2026-11-30 09:00:00', '', 300, 'Ako', 'Ang god', '09122220101010', 'asdfg@sdafsd', 'Sa bulsa ni mama', 10000.00, '{\"facilityId\":\"1\",\"participants\":[\"members\\/office staff only\",\"with other UC students\\/employees\"],\"checklist\":[\"Budget Request Form\",\"Copy of USC\\/CSC\\/Alternative Resolution\",\"Copy of Program\\/Schedule of Activities\",\"Copy of Promotional Materials\\/Posters\",\"Excuse Letter for Students\"],\"bmo\":[\"laptop\",\"projector\",\"PA system\",\"AV mixer\"],\"lmo\":[],\"itss\":[],\"admin\":[],\"charges\":[],\"college\":\"Information Technology and Computer Science\",\"organization\":\"CITCS\",\"title\":\"CITCS week\",\"nature\":\"Event\",\"start\":\"2026-11-20T08:00\",\"end\":\"2026-11-30T09:00\",\"participantsTotal\":\"300\",\"budgetSource\":\"Sa bulsa ni mama\",\"budget\":\"10000\",\"personName\":\"Ako\",\"personDesignation\":\"Ang god\",\"personContact\":\"09122220101010\",\"personEmail\":\"asdfg@sdafsd\",\"adviserDate\":\"2026-11-20\",\"presidentDate\":\"2026-11-28\",\"adviserNotedDate\":\"2026-11-21\",\"deanDate\":\"2026-11-20\",\"vpAcadDate\":\"2026-11-20\",\"venueReservedDate\":\"2026-11-20\",\"bmoVenue\":\"Gymnasium\",\"bmoDate\":\"2026-11-20\",\"activityType\":\"Academic\"}'),
(61, 61, 5, 'Academic', 'CITCS', 'asdf', 'asdfasd', '2026-11-24 08:30:00', '2026-11-24 17:00:00', '', 234234, 'wqerq', 'qwerqwe', '13123', 'safs@fasdafs', 'Sa bulsa ni mama', 1.00, '{\"facilityId\":\"5\",\"participants\":[\"members\\/office staff only\",\"with other UC students\\/employees\",\"open to Public\\/Outsiders\"],\"checklist\":[],\"bmo\":[],\"lmo\":[],\"itss\":[],\"admin\":[],\"charges\":[],\"college\":\"CITCS\",\"organization\":\"CITCS\",\"title\":\"asdf\",\"nature\":\"asdfasd\",\"start\":\"2026-11-24T08:30\",\"end\":\"2026-11-24T17:00\",\"participantsTotal\":\"234234\",\"budgetSource\":\"Sa bulsa ni mama\",\"budget\":\"1\",\"personName\":\"wqerq\",\"personDesignation\":\"qwerqwe\",\"personContact\":\"13123\",\"personEmail\":\"safs@fasdafs\",\"activityType\":\"Academic\"}'),
(64, 64, 4, 'Academic', 'WER', 'QWEQ', 'QWERQ', '2027-02-06 08:30:00', '2027-02-27 09:30:00', '', 123, 'SDFGH', 'DFGHDFG', '123412', 'asdfa@adasa', 'EFSG', 134.00, '{\"facilityId\":\"4\",\"participants\":[\"members\\/office staff only\",\"open to Public\\/Outsiders\",\"with other UC students\\/employees\"],\"checklist\":[],\"bmo\":[],\"lmo\":[],\"itss\":[],\"admin\":[],\"charges\":[],\"organization\":\"WER\",\"title\":\"QWEQ\",\"nature\":\"QWERQ\",\"college\":\"QWERQW\",\"start\":\"2027-02-06T08:30\",\"end\":\"2027-02-27T09:30\",\"participantsTotal\":\"123\",\"budgetSource\":\"EFSG\",\"budget\":\"134\",\"personName\":\"SDFGH\",\"personDesignation\":\"DFGHDFG\",\"personContact\":\"123412\",\"personEmail\":\"asdfa@adasa\",\"activityType\":\"Academic\"}'),
(65, 76, 2, 'Academic', 'sdfs', 'dfgsd', 'sdfgsfd', '2026-12-12 09:00:00', '2026-12-18 09:30:00', 'members/office staff only, with other UC students/employees, open to Public/Outsiders', 1218, 'gasdfa', 'asdfasd', '12312', 'asdfas@gsdfgs', 'sdfgdf', 12312.00, '{\"facilityId\":\"2\",\"participants\":[\"members\\/office staff only\",\"with other UC students\\/employees\",\"open to Public\\/Outsiders\"],\"checklist\":[],\"bmo\":[],\"lmo\":[],\"itss\":[],\"admin\":[],\"charges\":[],\"college\":\"sdfg\",\"activityType\":\"Academic\",\"organization\":\"sdfs\",\"title\":\"dfgsd\",\"nature\":\"sdfgsfd\",\"start\":\"2026-12-12T09:00\",\"end\":\"2026-12-18T09:30\",\"participantsTotal\":\"1218\",\"budgetSource\":\"sdfgdf\",\"budget\":\"12312\",\"personName\":\"gasdfa\",\"personDesignation\":\"asdfasd\",\"personContact\":\"12312\",\"personEmail\":\"asdfas@gsdfgs\"}'),
(66, 79, 2, 'Academic', 'asdaasd', 'asda', 'dada', '2026-12-18 09:30:00', '2026-12-18 10:00:00', 'members/office staff only, with other UC students/employees, open to Public/Outsiders', 12321, 'dasfg', 'asdfasd', '12321321a', 'ga@asfsr', 'fawe', 1232.00, '{\"facilityId\":\"2\",\"participants\":[\"members\\/office staff only\",\"with other UC students\\/employees\",\"open to Public\\/Outsiders\"],\"checklist\":[],\"bmo\":[],\"lmo\":[],\"itss\":[],\"admin\":[],\"charges\":[],\"college\":\"sfas\",\"activityType\":\"Academic\",\"organization\":\"asdaasd\",\"title\":\"asda\",\"nature\":\"dada\",\"start\":\"2026-12-18T09:30\",\"end\":\"2026-12-18T10:00\",\"participantsTotal\":\"12321\",\"budgetSource\":\"fawe\",\"budget\":\"1232\",\"personName\":\"dasfg\",\"personDesignation\":\"asdfasd\",\"personContact\":\"12321321a\",\"personEmail\":\"ga@asfsr\"}'),
(67, 80, 2, 'Non-Academic', 'sdfsas', 'dfaasdf', 'as', '2026-12-25 09:00:00', '2026-12-31 09:30:00', 'with other UC students/employees', 12294, 'asdfasasd', 'fasd1', '23213', 'adfgfds@sfgsdf', 'sdfga', 12312.00, '{\"facilityId\":\"2\",\"participants\":[\"with other UC students\\/employees\"],\"checklist\":[],\"bmo\":[],\"lmo\":[],\"itss\":[],\"admin\":[],\"charges\":[],\"activityType\":\"Non-Academic\",\"organization\":\"sdfsas\",\"title\":\"dfaasdf\",\"nature\":\"as\",\"start\":\"2026-12-25T09:00\",\"end\":\"2026-12-31T09:30\",\"participantsTotal\":\"12294\",\"budgetSource\":\"sdfga\",\"budget\":\"12312\",\"personName\":\"asdfasasd\",\"personDesignation\":\"fasd1\",\"personContact\":\"23213\",\"personEmail\":\"adfgfds@sfgsdf\",\"college\":\"asdasd\"}'),
(68, 81, 2, 'College/Institutional', 'dfasasdf', 'safasd', 'fasd', '2026-12-17 09:00:00', '2026-12-17 09:30:00', 'open to Public/Outsiders', 1231, 'safasdsafasd', 'safasd12', '321', 'safasd@safasd', 'safasd12', 213.00, '{\"facilityId\":\"2\",\"participants\":[\"open to Public\\/Outsiders\"],\"checklist\":[],\"bmo\":[],\"lmo\":[],\"itss\":[],\"admin\":[],\"charges\":[],\"college\":\"fgsgasg\",\"activityType\":\"College\\/Institutional\",\"organization\":\"dfasasdf\",\"title\":\"safasd\",\"nature\":\"fasd\",\"start\":\"2026-12-17T09:00\",\"end\":\"2026-12-17T09:30\",\"participantsTotal\":\"1231\",\"budgetSource\":\"safasd12\",\"budget\":\"213\",\"personName\":\"safasdsafasd\",\"personDesignation\":\"safasd12\",\"personContact\":\"321\",\"personEmail\":\"safasd@safasd\"}'),
(69, 82, 1, 'Academic', 'CITCS', 'Intramurals', 'Sports', '2026-12-07 16:30:00', '2026-12-08 17:00:00', 'members/office staff only, with other UC students/employees, open to Public/Outsiders', 5000, 'Kacey', 'Officer', '091292912231', 'user@gmail.com', 'Funds', 10000.00, '{\"facilityId\":\"1\",\"participants\":[\"members\\/office staff only\",\"with other UC students\\/employees\",\"open to Public\\/Outsiders\"],\"checklist\":[],\"bmo\":[],\"lmo\":[],\"itss\":[],\"admin\":[],\"charges\":[],\"college\":\"Information technology\",\"activityType\":\"Academic\",\"organization\":\"CITCS\",\"title\":\"Intramurals\",\"nature\":\"Sports\",\"start\":\"2026-12-07T16:30\",\"end\":\"2026-12-08T17:00\",\"participantsTotal\":\"5000\",\"budgetSource\":\"Funds\",\"budget\":\"10000\",\"personName\":\"Kacey\",\"personDesignation\":\"Officer\",\"personContact\":\"091292912231\",\"personEmail\":\"user@gmail.com\"}');

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `sarf_id` int(11) NOT NULL,
  `facility_id` int(11) NOT NULL,
  `event_title` varchar(255) NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'scheduled',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`id`, `sarf_id`, `facility_id`, `event_title`, `start_datetime`, `end_datetime`, `status`, `created_at`) VALUES
(1, 64, 4, 'QWEQ', '2027-02-06 08:30:00', '2027-02-27 09:30:00', 'scheduled', '2026-11-21 17:00:55'),
(2, 80, 2, 'dfaasdf', '2026-12-25 09:00:00', '2026-12-31 09:30:00', 'scheduled', '2026-11-22 15:36:12'),
(3, 79, 2, 'asda', '2026-12-18 09:30:00', '2026-12-18 10:00:00', 'scheduled', '2026-11-22 15:36:23'),
(4, 82, 1, 'Intramurals', '2026-12-07 16:30:00', '2026-12-08 17:00:00', 'scheduled', '2026-11-22 17:37:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`) VALUES
(1, 'Administrator', 'admin@campus.test', '$2y$10$kJC3bH5oN7AJ.SoqxYBA8uZZu.ZN7TsTA3E1SC8NrNnwP0tXPmg5O');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `facility`
--
ALTER TABLE `facility`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `requester_accounts`
--
ALTER TABLE `requester_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_requester_email` (`email`);

--
-- Indexes for table `sarf`
--
ALTER TABLE `sarf`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `control_number` (`control_number`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `idx_sarf_requester` (`requester_id`);

--
-- Indexes for table `sarf_req`
--
ALTER TABLE `sarf_req`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sarf_id` (`sarf_id`),
  ADD KEY `idx_overlap` (`facility_id`,`start_datetime`,`end_datetime`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sarf_id` (`sarf_id`),
  ADD KEY `facility_id` (`facility_id`),
  ADD KEY `start_datetime` (`start_datetime`,`end_datetime`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `facility`
--
ALTER TABLE `facility`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `requester_accounts`
--
ALTER TABLE `requester_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sarf`
--
ALTER TABLE `sarf`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `sarf_req`
--
ALTER TABLE `sarf_req`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sarf`
--
ALTER TABLE `sarf`
  ADD CONSTRAINT `fk_sarf_requester` FOREIGN KEY (`requester_id`) REFERENCES `requester_accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `sarf_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `sarf_req`
--
ALTER TABLE `sarf_req`
  ADD CONSTRAINT `sarf_req_ibfk_1` FOREIGN KEY (`sarf_id`) REFERENCES `sarf` (`id`),
  ADD CONSTRAINT `sarf_req_ibfk_2` FOREIGN KEY (`facility_id`) REFERENCES `facility` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
