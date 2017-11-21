SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `forum_topic`
-- ----------------------------
DROP TABLE IF EXISTS `forum_topic`;
CREATE TABLE `forum_topic` (
  `id` mediumint(9) NOT NULL auto_increment,
  `user_id` mediumint(9) NOT NULL,
  `topic_type` mediumint(9),
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`) USING BTREE,
  KEY `topic_type` (`topic_type`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='论坛主题';

SET FOREIGN_KEY_CHECKS = 1;
