SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `forum_topic_back`
-- ----------------------------
DROP TABLE IF EXISTS `forum_topic_back`;
CREATE TABLE `forum_topic_back` (
  `id` mediumint(9) NOT NULL auto_increment,
  `author_id` mediumint(9) NOT NULL,
  `user_id` mediumint(9) NOT NULL,
  `topic_id` mediumint(9) NOT NULL,
  `reply_num` mediumint(9) NOT NULL DEFAULT 0,
  `content` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`) USING BTREE,
  KEY `topic_id` (`topic_id`) USING BTREE,
  KEY `author_id` (`author_id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='论坛主题回复';

SET FOREIGN_KEY_CHECKS = 1;
