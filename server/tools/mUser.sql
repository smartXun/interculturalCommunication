SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `mUser`
-- ----------------------------
DROP TABLE IF EXISTS `mUser`;
CREATE TABLE `mUser` (
  `u_id` mediumint(9) NOT NULL auto_increment,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL,
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci,
  `session_key` varchar(100) COLLATE utf8mb4_unicode_ci,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`u_id`),
  KEY `u_id` (`u_id`) USING BTREE,
  KEY `open_id` (`open_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息';

SET FOREIGN_KEY_CHECKS = 1;
