SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `kit`
-- ----------------------------
DROP TABLE IF EXISTS `kit`;
CREATE TABLE `kit` (
  `id` mediumint(9) NOT NULL auto_increment,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` mediumint(9) DEFAULT 0,
  `like_num` mediumint(9) NOT NULL DEFAULT 0,
  `back_num` mediumint(9) NOT NULL DEFAULT 0,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Kit文章';

SET FOREIGN_KEY_CHECKS = 1;
