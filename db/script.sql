DROP TABLE IF EXISTS `provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `provider` (
  `provider_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `lowest_price` bigint(20) NOT NULL,
  `email` varchar(100) NOT NULL DEFAULT '',
  `rating` int(11) NULL DEFAULT NULL ,
  `max_speed` int(11) NULL DEFAULT NULL ,
  `description` varchar(100) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `image` varchar(24) NULL,
  `url` varchar(50)  NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`provider_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;





-- ALTER TABLE `distributor_purchases` ADD `is_active` INT NOT NULL DEFAULT '0' AFTER `created_at`;


-- Run ==>> sudo mysql  db_dev < script.sql