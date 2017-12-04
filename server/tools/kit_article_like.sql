SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `kit_article_like`
-- ----------------------------
DROP TABLE IF EXISTS `kit_article_like`;
CREATE TABLE `kit_article_like` (
  `id` mediumint(9) NOT NULL auto_increment,
  `user_id` mediumint(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `a_id` mediumint(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`) USING BTREE,
  KEY `a_id` (`a_id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='kit文章喜欢';

SET FOREIGN_KEY_CHECKS = 1;
