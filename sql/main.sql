CREATE DATABASE flight;
use flight;

-- 管理员表
CREATE TABLE adminuser (
  admin_name VARCHAR(40) NOT NULL PRIMARY KEY,
  admin_password VARCHAR(40) NOT NULL CHECK (CHAR_LENGTH(admin_password) BETWEEN 8 AND 40)
);

-- 管理员表数据
INSERT INTO adminuser (admin_name, admin_password) VALUES
('admin1', 'Admin12345'),
('admin2', 'Password123'),
('admin3', 'SecurePass678'),
('admin4', 'RootAdmin999');

-- SELECT * FROM adminuser;

-- 旅行社表
CREATE TABLE normaluser (
  user_name VARCHAR(40) NOT NULL PRIMARY KEY,
  user_password VARCHAR(40) NOT NULL CHECK (CHAR_LENGTH(user_password) BETWEEN 8 AND 40 AND user_password REGEXP '^(?=.*[A-Za-z])(?=.*[0-9]).+$')
);

-- 旅行社表数据
INSERT INTO normaluser (user_name, user_password) VALUES
('agencyA', 'Travel123'),
('agencyB', 'Agency456'),
('agencyC', 'Tour7890'),
('agencyD', 'Voyage321');

-- SELECT * FROM normaluser;

-- 航班表
CREATE TABLE flight (
  fli_num VARCHAR(40) NOT NULL PRIMARY KEY,
  fli_dep_loc VARCHAR(40) NOT NULL,
  fli_arr_loc VARCHAR(40) NOT NULL,
  fli_dep_time VARCHAR(40) NOT NULL CHECK (fli_dep_time REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$'),
  fli_arr_time VARCHAR(40) NOT NULL CHECK (fli_arr_time REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$')
);

-- 航班表数据
INSERT INTO flight (fli_num, fli_dep_loc, fli_arr_loc, fli_dep_time, fli_arr_time) VALUES
('CA1234', '北京', '上海', '2024-12-25 08:00', '2024-12-25 10:30'),
('MU5678', '广州', '成都', '2024-12-26 14:00', '2024-12-26 16:45'),
('CZ9012', '深圳', '杭州', '2024-12-27 09:30', '2024-12-27 12:00'),
('HU3456', '西安', '昆明', '2024-12-28 17:45', '2024-12-28 20:15'),
('MF7890', '南京', '重庆', '2024-12-29 10:15', '2024-12-29 13:00');


-- SELECT * FROM flight;

-- 座位表
CREATE TABLE seat (
  fli_num VARCHAR(40) NOT NULL,
  seat_type VARCHAR(40) NOT NULL CHECK (seat_type IN ('经济舱', '商务舱', '头等舱')),
  seat_price INT DEFAULT 0 NOT NULL,
  seat_ordered TINYINT UNSIGNED DEFAULT 0 NOT NULL,
  seat_remain TINYINT UNSIGNED DEFAULT 0 NOT NULL,
--   PRIMARY KEY (fli_num, seat_type),
  FOREIGN KEY (fli_num) REFERENCES flight(fli_num)
);

-- 座位表数据
INSERT INTO seat (fli_num, seat_type, seat_price, seat_ordered, seat_remain) VALUES
('CA1234', '经济舱', 500, 50, 200),
('CA1234', '商务舱', 1200, 10, 30),
('CA1234', '头等舱', 2500, 5, 15),
('MU5678', '经济舱', 600, 40, 180),
('MU5678', '商务舱', 1300, 8, 22),
('MU5678', '头等舱', 2800, 4, 16),
('CZ9012', '经济舱', 550, 60, 190),
('CZ9012', '商务舱', 1250, 12, 28),
('CZ9012', '头等舱', 2600, 6, 14),
('HU3456', '经济舱', 520, 55, 185),
('HU3456', '商务舱', 1230, 15, 25),
('HU3456', '头等舱', 2550, 7, 13),
('MF7890', '经济舱', 580, 45, 195),
('MF7890', '商务舱', 1350, 10, 20),
('MF7890', '头等舱', 2700, 5, 15);

-- SELECT * FROM seat;

-- 旅客表
CREATE TABLE passenger (
  user_name VARCHAR(40) NOT NULL,
  pass_name VARCHAR(40) NOT NULL,
  pass_gender CHAR(1) NOT NULL CHECK (pass_gender IN ('男', '女')),
  pass_idnum VARCHAR(40) NOT NULL PRIMARY KEY,
  pass_phone VARCHAR(20) NOT NULL,
  FOREIGN KEY (user_name) REFERENCES normaluser(user_name)
);

-- 旅客表数据
INSERT INTO passenger (user_name, pass_name, pass_gender, pass_idnum, pass_phone) VALUES
('agencyA', '张三', '男', '110101199001011234', '13800001111'),
('agencyA', '李四', '女', '110101199202021234', '13800002222'),
('agencyB', '王五', '男', '110101199303031234', '13800003333'),
('agencyB', '赵六', '女', '110101199404041234', '13800004444'),
('agencyC', '孙七', '男', '110101199505051234', '13800005555'),
('agencyC', '周八', '女', '110101199606061234', '13800006666'),
('agencyD', '吴九', '男', '110101199707071234', '13800007777'),
('agencyD', '郑十', '女', '110101199808081234', '13800008888');

-- SELECT * FROM passenger;

-- -- 检查是否存在重复的旅客身份证号码
-- SELECT pass_idnum, COUNT(*) 
-- FROM passenger 
-- GROUP BY pass_idnum 
-- HAVING COUNT(*) > 1;

-- 订票表
CREATE TABLE ticket (
  fli_num VARCHAR(40) NOT NULL,
  pass_idnum VARCHAR(40) NOT NULL,
  seat_type VARCHAR(40) NOT NULL CHECK (seat_type IN ('经济舱', '商务舱', '头等舱')),
  pay CHAR(2) NOT NULL DEFAULT '否' CHECK (pay IN ('是', '否')),
  PRIMARY KEY (fli_num, pass_idnum, seat_type),
  FOREIGN KEY (fli_num) REFERENCES flight(fli_num),
  FOREIGN KEY (pass_idnum) REFERENCES passenger(pass_idnum)
--   FOREIGN KEY (seat_type) REFERENCES seat(seat_type)
);

-- 订票表数据
INSERT INTO ticket (fli_num, pass_idnum, seat_type, pay) VALUES
('CA1234', '110101199001011234', '经济舱', '是'),
('CA1234', '110101199202021234', '商务舱', '否'),
('MU5678', '110101199303031234', '头等舱', '是'),
('MU5678', '110101199404041234', '经济舱', '否'),
('CZ9012', '110101199505051234', '经济舱', '是'),
('CZ9012', '110101199606061234', '商务舱', '否'),
('HU3456', '110101199707071234', '头等舱', '是'),
('HU3456', '110101199808081234', '经济舱', '否'),
('MF7890', '110101199001011234', '经济舱', '是'),
('MF7890', '110101199303031234', '商务舱', '否');

-- 查看订票表所有数据
-- SELECT * FROM ticket;
