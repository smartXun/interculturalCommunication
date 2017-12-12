SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `forum_back_reply`
-- ----------------------------
DROP TABLE IF EXISTS `forum_back_reply`;
CREATE TABLE `forum_back_reply` (
  `id` mediumint(9) NOT NULL auto_increment,
  `user_id` mediumint(9) NOT NULL,
  `back_id` mediumint(9) NOT NULL,
  `reply_user_id` mediumint(9) NOT NULL,
  `content` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE,
  KEY `back_id` (`back_id`) USING BTREE,
  KEY `reply_user_id` (`reply_user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='论坛评论回复';

SET FOREIGN_KEY_CHECKS = 1;
