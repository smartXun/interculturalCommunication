SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `forum_topic_like`
-- ----------------------------
DROP TABLE IF EXISTS `forum_topic_like`;
CREATE TABLE `forum_topic_like` (
  `id` mediumint(9) NOT NULL auto_increment,
  `user_id` mediumint(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `topic_id` mediumint(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`) USING BTREE,
  KEY `topic_id` (`topic_id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='论坛主题喜欢';

SET FOREIGN_KEY_CHECKS = 1;
