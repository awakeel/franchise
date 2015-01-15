/*
SQLyog Ultimate v11.5 (64 bit)
MySQL - 5.6.17 : Database - franchise
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`franchise` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `franchise`;

/*Table structure for table `branches` */

DROP TABLE IF EXISTS `branches`;

CREATE TABLE `branches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `notes` text NOT NULL,
  `franchiseid` int(11) NOT NULL,
  `createdby` int(11) NOT NULL,
  `createdon` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isdeleted` tinyint(2) NOT NULL,
  `isactivated` tinyint(2) NOT NULL,
  `timingid` int(11) NOT NULL,
  `packageid` int(11) NOT NULL,
  `countryid` int(11) NOT NULL,
  `currencyid` int(11) NOT NULL,
  `languageid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1;

/*Data for the table `branches` */

insert  into `branches`(`id`,`name`,`notes`,`franchiseid`,`createdby`,`createdon`,`isdeleted`,`isactivated`,`timingid`,`packageid`,`countryid`,`currencyid`,`languageid`) values (42,'I 8 Department','I8 1 Department',1,0,'2015-01-09 15:51:29',0,0,0,0,0,0,0),(43,'I 8 Department','I8 1 Department',1,0,'2015-01-09 15:51:29',0,0,0,0,0,0,0),(44,'I 8 Department','I8 1 Department',1,0,'2015-01-09 15:51:29',0,0,0,0,0,0,0),(45,'aa','aa',1,0,'2015-01-09 15:55:22',0,0,0,0,2,140,1),(46,'aa','aa',1,0,'2015-01-09 15:55:22',0,0,0,0,2,140,1),(47,'Department Rule 1','Dep 1',1,0,'2015-01-09 15:58:23',0,0,0,0,1,140,1);

/*Table structure for table `countries` */

DROP TABLE IF EXISTS `countries`;

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `short` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `fullname` varchar(200) DEFAULT NULL,
  `short1` varchar(20) DEFAULT NULL,
  `memcode` varchar(20) DEFAULT NULL,
  `number` varchar(20) DEFAULT NULL,
  `caling` varchar(20) DEFAULT NULL,
  `domain` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `countries` */

insert  into `countries`(`id`,`short`,`name`,`fullname`,`short1`,`memcode`,`number`,`caling`,`domain`,`password`) values (1,'AF','Afghanistan','Islamic Republic of Afghanistan','AFG','004','yes','93','.af',NULL),(2,'AX','Aland Islands','&Aring;land Islands','ALA','248','no','358','.ax',NULL),(3,'AL','Albania','Republic of Albania','ALB','008','yes','355','.al',NULL),(4,'DZ','Algeria','People\'s Democratic Republic of Algeria','DZA','012','yes','213','.dz',NULL),(5,'AS','American Samoa','American Samoa','ASM','016','no','1+684','.as',NULL),(6,'AD','Andorra','Principality of Andorra','AND','020','yes','376','.ad',NULL),(7,'AO','Angola','Republic of Angola','AGO','024','yes','244','.ao',NULL),(8,'AI','Anguilla','Anguilla','AIA','660','no','1+264','.ai',NULL),(9,'AQ','Antarctica','Antarctica','ATA','010','no','672','.aq',NULL),(10,'AG','Antigua and Barbuda','Antigua and Barbuda','ATG','028','yes','1+268','.ag',NULL),(11,'AR','Argentina','Argentine Republic','ARG','032','yes','54','.ar',NULL),(12,'AM','Armenia','Republic of Armenia','ARM','051','yes','374','.am',NULL),(13,'AW','Aruba','Aruba','ABW','533','no','297','.aw',NULL),(14,'AU','Australia','Commonwealth of Australia','AUS','036','yes','61','.au',NULL),(15,'AT','Austria','Republic of Austria','AUT','040','yes','43','.at',NULL),(16,'AZ','Azerbaijan','Republic of Azerbaijan','AZE','031','yes','994','.az',NULL),(17,'BS','Bahamas','Commonwealth of The Bahamas','BHS','044','yes','1+242','.bs',NULL),(18,'BH','Bahrain','Kingdom of Bahrain','BHR','048','yes','973','.bh',NULL),(19,'BD','Bangladesh','People\'s Republic of Bangladesh','BGD','050','yes','880','.bd',NULL),(20,'BB','Barbados','Barbados','BRB','052','yes','1+246','.bb',NULL),(21,'BY','Belarus','Republic of Belarus','BLR','112','yes','375','.by',NULL),(22,'BE','Belgium','Kingdom of Belgium','BEL','056','yes','32','.be',NULL),(23,'BZ','Belize','Belize','BLZ','084','yes','501','.bz',NULL),(24,'BJ','Benin','Republic of Benin','BEN','204','yes','229','.bj',NULL),(25,'BM','Bermuda','Bermuda Islands','BMU','060','no','1+441','.bm',NULL),(26,'BT','Bhutan','Kingdom of Bhutan','BTN','064','yes','975','.bt',NULL),(27,'BO','Bolivia','Plurinational State of Bolivia','BOL','068','yes','591','.bo',NULL),(28,'BQ','Bonaire, Sint Eustatius and Saba','Bonaire, Sint Eustatius and Saba','BES','535','no','599','.bq',NULL),(29,'BA','Bosnia and Herzegovina','Bosnia and Herzegovina','BIH','070','yes','387','.ba',NULL),(30,'BW','Botswana','Republic of Botswana','BWA','072','yes','267','.bw',NULL),(31,'BV','Bouvet Island','Bouvet Island','BVT','074','no','NONE','.bv',NULL),(32,'BR','Brazil','Federative Republic of Brazil','BRA','076','yes','55','.br',NULL),(33,'IO','British Indian Ocean Territory','British Indian Ocean Territory','IOT','086','no','246','.io',NULL),(34,'BN','Brunei','Brunei Darussalam','BRN','096','yes','673','.bn',NULL),(35,'BG','Bulgaria','Republic of Bulgaria','BGR','100','yes','359','.bg',NULL),(36,'BF','Burkina Faso','Burkina Faso','BFA','854','yes','226','.bf',NULL),(37,'BI','Burundi','Republic of Burundi','BDI','108','yes','257','.bi',NULL),(38,'KH','Cambodia','Kingdom of Cambodia','KHM','116','yes','855','.kh',NULL),(39,'CM','Cameroon','Republic of Cameroon','CMR','120','yes','237','.cm',NULL),(40,'CA','Canada','Canada','CAN','124','yes','1','.ca',NULL),(41,'CV','Cape Verde','Republic of Cape Verde','CPV','132','yes','238','.cv',NULL),(42,'KY','Cayman Islands','The Cayman Islands','CYM','136','no','1+345','.ky',NULL),(43,'CF','Central African Republic','Central African Republic','CAF','140','yes','236','.cf',NULL),(44,'TD','Chad','Republic of Chad','TCD','148','yes','235','.td',NULL),(45,'CL','Chile','Republic of Chile','CHL','152','yes','56','.cl',NULL),(46,'CN','China','People\'s Republic of China','CHN','156','yes','86','.cn',NULL),(47,'CX','Christmas Island','Christmas Island','CXR','162','no','61','.cx',NULL),(48,'CC','Cocos (Keeling) Islands','Cocos (Keeling) Islands','CCK','166','no','61','.cc',NULL),(49,'CO','Colombia','Republic of Colombia','COL','170','yes','57','.co',NULL),(50,'KM','Comoros','Union of the Comoros','COM','174','yes','269','.km',NULL),(51,'CG','Congo','Republic of the Congo','COG','178','yes','242','.cg',NULL),(52,'CK','Cook Islands','Cook Islands','COK','184','some','682','.ck',NULL),(53,'CR','Costa Rica','Republic of Costa Rica','CRI','188','yes','506','.cr',NULL),(54,'CI','Cote d\'ivoire (Ivory Coast)','Republic of C&ocirc;te D\'Ivoire (Ivory Coast)','CIV','384','yes','225','.ci',NULL),(55,'HR','Croatia','Republic of Croatia','HRV','191','yes','385','.hr',NULL),(56,'CU','Cuba','Republic of Cuba','CUB','192','yes','53','.cu',NULL),(57,'CW','Curacao','Cura&ccedil;ao','CUW','531','no','599','.cw',NULL),(58,'CY','Cyprus','Republic of Cyprus','CYP','196','yes','357','.cy',NULL),(59,'CZ','Czech Republic','Czech Republic','CZE','203','yes','420','.cz',NULL),(60,'CD','Democratic Republic of the Congo','Democratic Republic of the Congo','COD','180','yes','243','.cd',NULL),(61,'DK','Denmark','Kingdom of Denmark','DNK','208','yes','45','.dk',NULL),(62,'DJ','Djibouti','Republic of Djibouti','DJI','262','yes','253','.dj',NULL),(63,'DM','Dominica','Commonwealth of Dominica','DMA','212','yes','1+767','.dm',NULL),(64,'DO','Dominican Republic','Dominican Republic','DOM','214','yes','1+809, 8','.do',NULL),(65,'EC','Ecuador','Republic of Ecuador','ECU','218','yes','593','.ec',NULL),(66,'EG','Egypt','Arab Republic of Egypt','EGY','818','yes','20','.eg',NULL),(67,'SV','El Salvador','Republic of El Salvador','SLV','222','yes','503','.sv',NULL),(68,'GQ','Equatorial Guinea','Republic of Equatorial Guinea','GNQ','226','yes','240','.gq',NULL),(69,'ER','Eritrea','State of Eritrea','ERI','232','yes','291','.er',NULL),(70,'EE','Estonia','Republic of Estonia','EST','233','yes','372','.ee',NULL),(71,'ET','Ethiopia','Federal Democratic Republic of Ethiopia','ETH','231','yes','251','.et',NULL),(72,'FK','Falkland Islands (Malvinas)','The Falkland Islands (Malvinas)','FLK','238','no','500','.fk',NULL),(73,'FO','Faroe Islands','The Faroe Islands','FRO','234','no','298','.fo',NULL),(74,'FJ','Fiji','Republic of Fiji','FJI','242','yes','679','.fj',NULL),(75,'FI','Finland','Republic of Finland','FIN','246','yes','358','.fi',NULL),(76,'FR','France','French Republic','FRA','250','yes','33','.fr',NULL),(77,'GF','French Guiana','French Guiana','GUF','254','no','594','.gf',NULL),(78,'PF','French Polynesia','French Polynesia','PYF','258','no','689','.pf',NULL),(79,'TF','French Southern Territories','French Southern Territories','ATF','260','no',NULL,'.tf',NULL),(80,'GA','Gabon','Gabonese Republic','GAB','266','yes','241','.ga',NULL),(81,'GM','Gambia','Republic of The Gambia','GMB','270','yes','220','.gm',NULL),(82,'GE','Georgia','Georgia','GEO','268','yes','995','.ge',NULL),(83,'DE','Germany','Federal Republic of Germany','DEU','276','yes','49','.de',NULL),(84,'GH','Ghana','Republic of Ghana','GHA','288','yes','233','.gh',NULL),(85,'GI','Gibraltar','Gibraltar','GIB','292','no','350','.gi',NULL),(86,'GR','Greece','Hellenic Republic','GRC','300','yes','30','.gr',NULL),(87,'GL','Greenland','Greenland','GRL','304','no','299','.gl',NULL),(88,'GD','Grenada','Grenada','GRD','308','yes','1+473','.gd',NULL),(89,'GP','Guadaloupe','Guadeloupe','GLP','312','no','590','.gp',NULL),(90,'GU','Guam','Guam','GUM','316','no','1+671','.gu',NULL),(91,'GT','Guatemala','Republic of Guatemala','GTM','320','yes','502','.gt',NULL),(92,'GG','Guernsey','Guernsey','GGY','831','no','44','.gg',NULL),(93,'GN','Guinea','Republic of Guinea','GIN','324','yes','224','.gn',NULL),(94,'GW','Guinea-Bissau','Republic of Guinea-Bissau','GNB','624','yes','245','.gw',NULL),(95,'GY','Guyana','Co-operative Republic of Guyana','GUY','328','yes','592','.gy',NULL),(96,'HT','Haiti','Republic of Haiti','HTI','332','yes','509','.ht',NULL),(97,'HM','Heard Island and McDonald Islands','Heard Island and McDonald Islands','HMD','334','no','NONE','.hm',NULL),(98,'HN','Honduras','Republic of Honduras','HND','340','yes','504','.hn',NULL),(99,'HK','Hong Kong','Hong Kong','HKG','344','no','852','.hk',NULL),(100,'HU','Hungary','Hungary','HUN','348','yes','36','.hu',NULL),(101,'IS','Iceland','Republic of Iceland','ISL','352','yes','354','.is',NULL),(102,'IN','India','Republic of India','IND','356','yes','91','.in',NULL),(103,'ID','Indonesia','Republic of Indonesia','IDN','360','yes','62','.id',NULL),(104,'IR','Iran','Islamic Republic of Iran','IRN','364','yes','98','.ir',NULL),(105,'IQ','Iraq','Republic of Iraq','IRQ','368','yes','964','.iq',NULL),(106,'IE','Ireland','Ireland','IRL','372','yes','353','.ie',NULL),(107,'IM','Isle of Man','Isle of Man','IMN','833','no','44','.im',NULL),(108,'IL','Israel','State of Israel','ISR','376','yes','972','.il',NULL),(109,'IT','Italy','Italian Republic','ITA','380','yes','39','.jm',NULL),(110,'JM','Jamaica','Jamaica','JAM','388','yes','1+876','.jm',NULL),(111,'JP','Japan','Japan','JPN','392','yes','81','.jp',NULL),(112,'JE','Jersey','The Bailiwick of Jersey','JEY','832','no','44','.je',NULL),(113,'JO','Jordan','Hashemite Kingdom of Jordan','JOR','400','yes','962','.jo',NULL),(114,'KZ','Kazakhstan','Republic of Kazakhstan','KAZ','398','yes','7','.kz',NULL),(115,'KE','Kenya','Republic of Kenya','KEN','404','yes','254','.ke',NULL),(116,'KI','Kiribati','Republic of Kiribati','KIR','296','yes','686','.ki',NULL),(117,'XK','Kosovo','Republic of Kosovo','---','---','some','381','',NULL),(118,'KW','Kuwait','State of Kuwait','KWT','414','yes','965','.kw',NULL),(119,'KG','Kyrgyzstan','Kyrgyz Republic','KGZ','417','yes','996','.kg',NULL),(120,'LA','Laos','Lao People\'s Democratic Republic','LAO','418','yes','856','.la',NULL),(121,'LV','Latvia','Republic of Latvia','LVA','428','yes','371','.lv',NULL),(122,'LB','Lebanon','Republic of Lebanon','LBN','422','yes','961','.lb',NULL),(123,'LS','Lesotho','Kingdom of Lesotho','LSO','426','yes','266','.ls',NULL),(124,'LR','Liberia','Republic of Liberia','LBR','430','yes','231','.lr',NULL),(125,'LY','Libya','Libya','LBY','434','yes','218','.ly',NULL),(126,'LI','Liechtenstein','Principality of Liechtenstein','LIE','438','yes','423','.li',NULL),(127,'LT','Lithuania','Republic of Lithuania','LTU','440','yes','370','.lt',NULL),(128,'LU','Luxembourg','Grand Duchy of Luxembourg','LUX','442','yes','352','.lu',NULL),(129,'MO','Macao','The Macao Special Administrative Region','MAC','446','no','853','.mo',NULL),(130,'MK','Macedonia','The Former Yugoslav Republic of Macedonia','MKD','807','yes','389','.mk',NULL),(131,'MG','Madagascar','Republic of Madagascar','MDG','450','yes','261','.mg',NULL),(132,'MW','Malawi','Republic of Malawi','MWI','454','yes','265','.mw',NULL),(133,'MY','Malaysia','Malaysia','MYS','458','yes','60','.my',NULL),(134,'MV','Maldives','Republic of Maldives','MDV','462','yes','960','.mv',NULL),(135,'ML','Mali','Republic of Mali','MLI','466','yes','223','.ml',NULL),(136,'MT','Malta','Republic of Malta','MLT','470','yes','356','.mt',NULL),(137,'MH','Marshall Islands','Republic of the Marshall Islands','MHL','584','yes','692','.mh',NULL),(138,'MQ','Martinique','Martinique','MTQ','474','no','596','.mq',NULL),(139,'MR','Mauritania','Islamic Republic of Mauritania','MRT','478','yes','222','.mr',NULL),(140,'MU','Mauritius','Republic of Mauritius','MUS','480','yes','230','.mu',NULL),(141,'YT','Mayotte','Mayotte','MYT','175','no','262','.yt',NULL),(142,'MX','Mexico','United Mexican States','MEX','484','yes','52','.mx',NULL),(143,'FM','Micronesia','Federated States of Micronesia','FSM','583','yes','691','.fm',NULL),(144,'MD','Moldava','Republic of Moldova','MDA','498','yes','373','.md',NULL),(145,'MC','Monaco','Principality of Monaco','MCO','492','yes','377','.mc',NULL),(146,'MN','Mongolia','Mongolia','MNG','496','yes','976','.mn',NULL),(147,'ME','Montenegro','Montenegro','MNE','499','yes','382','.me',NULL),(148,'MS','Montserrat','Montserrat','MSR','500','no','1+664','.ms',NULL),(149,'MA','Morocco','Kingdom of Morocco','MAR','504','yes','212','.ma',NULL),(150,'MZ','Mozambique','Republic of Mozambique','MOZ','508','yes','258','.mz',NULL),(151,'MM','Myanmar (Burma)','Republic of the Union of Myanmar','MMR','104','yes','95','.mm',NULL),(152,'NA','Namibia','Republic of Namibia','NAM','516','yes','264','.na',NULL),(153,'NR','Nauru','Republic of Nauru','NRU','520','yes','674','.nr',NULL),(154,'NP','Nepal','Federal Democratic Republic of Nepal','NPL','524','yes','977','.np',NULL),(155,'NL','Netherlands','Kingdom of the Netherlands','NLD','528','yes','31','.nl',NULL),(156,'NC','New Caledonia','New Caledonia','NCL','540','no','687','.nc',NULL),(157,'NZ','New Zealand','New Zealand','NZL','554','yes','64','.nz',NULL),(158,'NI','Nicaragua','Republic of Nicaragua','NIC','558','yes','505','.ni',NULL),(159,'NE','Niger','Republic of Niger','NER','562','yes','227','.ne',NULL),(160,'NG','Nigeria','Federal Republic of Nigeria','NGA','566','yes','234','.ng',NULL),(161,'NU','Niue','Niue','NIU','570','some','683','.nu',NULL),(162,'NF','Norfolk Island','Norfolk Island','NFK','574','no','672','.nf',NULL),(163,'KP','North Korea','Democratic People\'s Republic of Korea','PRK','408','yes','850','.kp',NULL),(164,'MP','Northern Mariana Islands','Northern Mariana Islands','MNP','580','no','1+670','.mp',NULL),(165,'NO','Norway','Kingdom of Norway','NOR','578','yes','47','.no',NULL),(166,'OM','Oman','Sultanate of Oman','OMN','512','yes','968','.om',NULL),(167,'PK','Pakistan','Islamic Republic of Pakistan','PAK','586','yes','92','.pk',NULL),(168,'PW','Palau','Republic of Palau','PLW','585','yes','680','.pw',NULL),(169,'PS','Palestine','State of Palestine (or Occupied Palestinian Territory)','PSE','275','some','970','.ps',NULL),(170,'PA','Panama','Republic of Panama','PAN','591','yes','507','.pa',NULL),(171,'PG','Papua New Guinea','Independent State of Papua New Guinea','PNG','598','yes','675','.pg',NULL),(172,'PY','Paraguay','Republic of Paraguay','PRY','600','yes','595','.py',NULL),(173,'PE','Peru','Republic of Peru','PER','604','yes','51','.pe',NULL),(174,'PH','Phillipines','Republic of the Philippines','PHL','608','yes','63','.ph',NULL),(175,'PN','Pitcairn','Pitcairn','PCN','612','no','NONE','.pn',NULL),(176,'PL','Poland','Republic of Poland','POL','616','yes','48','.pl',NULL),(177,'PT','Portugal','Portuguese Republic','PRT','620','yes','351','.pt',NULL),(178,'PR','Puerto Rico','Commonwealth of Puerto Rico','PRI','630','no','1+939','.pr',NULL),(179,'QA','Qatar','State of Qatar','QAT','634','yes','974','.qa',NULL),(180,'RE','Reunion','R&eacute;union','REU','638','no','262','.re',NULL),(181,'RO','Romania','Romania','ROU','642','yes','40','.ro',NULL),(182,'RU','Russia','Russian Federation','RUS','643','yes','7','.ru',NULL),(183,'RW','Rwanda','Republic of Rwanda','RWA','646','yes','250','.rw',NULL),(184,'BL','Saint Barthelemy','Saint Barth&eacute;lemy','BLM','652','no','590','.bl',NULL),(185,'SH','Saint Helena','Saint Helena, Ascension and Tristan da Cunha','SHN','654','no','290','.sh',NULL),(186,'KN','Saint Kitts and Nevis','Federation of Saint Christopher and Nevis','KNA','659','yes','1+869','.kn',NULL),(187,'LC','Saint Lucia','Saint Lucia','LCA','662','yes','1+758','.lc',NULL),(188,'MF','Saint Martin','Saint Martin','MAF','663','no','590','.mf',NULL),(189,'PM','Saint Pierre and Miquelon','Saint Pierre and Miquelon','SPM','666','no','508','.pm',NULL),(190,'VC','Saint Vincent and the Grenadines','Saint Vincent and the Grenadines','VCT','670','yes','1+784','.vc',NULL),(191,'WS','Samoa','Independent State of Samoa','WSM','882','yes','685','.ws',NULL),(192,'SM','San Marino','Republic of San Marino','SMR','674','yes','378','.sm',NULL),(193,'ST','Sao Tome and Principe','Democratic Republic of S&atilde;o Tom&eacute; and Pr&iacute;ncipe','STP','678','yes','239','.st',NULL),(194,'SA','Saudi Arabia','Kingdom of Saudi Arabia','SAU','682','yes','966','.sa',NULL),(195,'SN','Senegal','Republic of Senegal','SEN','686','yes','221','.sn',NULL),(196,'RS','Serbia','Republic of Serbia','SRB','688','yes','381','.rs',NULL),(197,'SC','Seychelles','Republic of Seychelles','SYC','690','yes','248','.sc',NULL),(198,'SL','Sierra Leone','Republic of Sierra Leone','SLE','694','yes','232','.sl',NULL),(199,'SG','Singapore','Republic of Singapore','SGP','702','yes','65','.sg',NULL),(200,'SX','Sint Maarten','Sint Maarten','SXM','534','no','1+721','.sx',NULL),(201,'SK','Slovakia','Slovak Republic','SVK','703','yes','421','.sk',NULL),(202,'SI','Slovenia','Republic of Slovenia','SVN','705','yes','386','.si',NULL),(203,'SB','Solomon Islands','Solomon Islands','SLB','090','yes','677','.sb',NULL),(204,'SO','Somalia','Somali Republic','SOM','706','yes','252','.so',NULL),(205,'ZA','South Africa','Republic of South Africa','ZAF','710','yes','27','.za',NULL),(206,'GS','South Georgia and the South Sandwich Islands','South Georgia and the South Sandwich Islands','SGS','239','no','500','.gs',NULL),(207,'KR','South Korea','Republic of Korea','KOR','410','yes','82','.kr',NULL),(208,'SS','South Sudan','Republic of South Sudan','SSD','728','yes','211','.ss',NULL),(209,'ES','Spain','Kingdom of Spain','ESP','724','yes','34','.es',NULL),(210,'LK','Sri Lanka','Democratic Socialist Republic of Sri Lanka','LKA','144','yes','94','.lk',NULL),(211,'SD','Sudan','Republic of the Sudan','SDN','729','yes','249','.sd',NULL),(212,'SR','Suriname','Republic of Suriname','SUR','740','yes','597','.sr',NULL),(213,'SJ','Svalbard and Jan Mayen','Svalbard and Jan Mayen','SJM','744','no','47','.sj',NULL),(214,'SZ','Swaziland','Kingdom of Swaziland','SWZ','748','yes','268','.sz',NULL),(215,'SE','Sweden','Kingdom of Sweden','SWE','752','yes','46','.se',NULL),(216,'CH','Switzerland','Swiss Confederation','CHE','756','yes','41','.ch',NULL),(217,'SY','Syria','Syrian Arab Republic','SYR','760','yes','963','.sy',NULL),(218,'TW','Taiwan','Republic of China (Taiwan)','TWN','158','former','886','.tw',NULL),(219,'TJ','Tajikistan','Republic of Tajikistan','TJK','762','yes','992','.tj',NULL),(220,'TZ','Tanzania','United Republic of Tanzania','TZA','834','yes','255','.tz',NULL),(221,'TH','Thailand','Kingdom of Thailand','THA','764','yes','66','.th',NULL),(222,'TL','Timor-Leste (East Timor)','Democratic Republic of Timor-Leste','TLS','626','yes','670','.tl',NULL),(223,'TG','Togo','Togolese Republic','TGO','768','yes','228','.tg',NULL),(224,'TK','Tokelau','Tokelau','TKL','772','no','690','.tk',NULL),(225,'TO','Tonga','Kingdom of Tonga','TON','776','yes','676','.to',NULL),(226,'TT','Trinidad and Tobago','Republic of Trinidad and Tobago','TTO','780','yes','1+868','.tt',NULL),(227,'TN','Tunisia','Republic of Tunisia','TUN','788','yes','216','.tn',NULL),(228,'TR','Turkey','Republic of Turkey','TUR','792','yes','90','.tr',NULL),(229,'TM','Turkmenistan','Turkmenistan','TKM','795','yes','993','.tm',NULL),(230,'TC','Turks and Caicos Islands','Turks and Caicos Islands','TCA','796','no','1+649','.tc',NULL),(231,'TV','Tuvalu','Tuvalu','TUV','798','yes','688','.tv',NULL),(232,'UG','Uganda','Republic of Uganda','UGA','800','yes','256','.ug',NULL),(233,'UA','Ukraine','Ukraine','UKR','804','yes','380','.ua',NULL),(234,'AE','United Arab Emirates','United Arab Emirates','ARE','784','yes','971','.ae',NULL),(235,'GB','United Kingdom','United Kingdom of Great Britain and Nothern Ireland','GBR','826','yes','44','.uk',NULL),(236,'US','United States','United States of America','USA','840','yes','1','.us',NULL),(237,'UM','United States Minor Outlying Islands','United States Minor Outlying Islands','UMI','581','no','NONE','NONE',NULL),(238,'UY','Uruguay','Eastern Republic of Uruguay','URY','858','yes','598','.uy',NULL),(239,'UZ','Uzbekistan','Republic of Uzbekistan','UZB','860','yes','998','.uz',NULL),(240,'VU','Vanuatu','Republic of Vanuatu','VUT','548','yes','678','.vu',NULL),(241,'VA','Vatican City','State of the Vatican City','VAT','336','no','39','.va',NULL),(242,'VE','Venezuela','Bolivarian Republic of Venezuela','VEN','862','yes','58','.ve',NULL),(243,'VN','Vietnam','Socialist Republic of Vietnam','VNM','704','yes','84','.vn',NULL),(244,'VG','Virgin Islands, British','British Virgin Islands','VGB','092','no','1+284','.vg',NULL),(245,'VI','Virgin Islands, US','Virgin Islands of the United States','VIR','850','no','1+340','.vi',NULL),(246,'WF','Wallis and Futuna','Wallis and Futuna','WLF','876','no','681','.wf',NULL),(247,'EH','Western Sahara','Western Sahara','ESH','732','no','212','.eh',NULL),(248,'YE','Yemen','Republic of Yemen','YEM','887','yes','967','.ye',NULL),(249,'ZM','Zambia','Republic of Zambia','ZMB','894','yes','260','.zm',NULL),(250,'ZW','Zimbabwe','Republic of Zimbabwe','ZWE','716','yes','263','.zw',NULL);

/*Table structure for table `currencies` */

DROP TABLE IF EXISTS `currencies`;

CREATE TABLE `currencies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET latin1 NOT NULL,
  `countryid` int(11) NOT NULL,
  `createdon` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdby` int(11) NOT NULL,
  `isdeleted` tinyint(2) NOT NULL,
  `code` varchar(20) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

/*Data for the table `currencies` */

insert  into `currencies`(`id`,`name`,`countryid`,`createdon`,`createdby`,`isdeleted`,`code`) values (2,'(South) Korean Won',0,'2015-01-07 12:02:15',0,0,'KRW'),(3,'Afghanistan Afghani',0,'2015-01-07 12:02:15',0,0,'AFA'),(4,'Albanian Lek',0,'2015-01-07 12:02:15',0,0,'ALL'),(5,'Algerian Dinar',0,'2015-01-07 12:02:15',0,0,'DZD'),(6,'Andorran Peseta',0,'2015-01-07 12:02:15',0,0,'ADP'),(7,'Angolan Kwanza',0,'2015-01-07 12:02:15',0,0,'AOK'),(8,'Argentine Peso',0,'2015-01-07 12:02:15',0,0,'ARS'),(9,'Armenian Dram',0,'2015-01-07 12:02:15',0,0,'AMD'),(10,'Aruban Florin',0,'2015-01-07 12:02:15',0,0,'AWG'),(11,'Australian Dollar',0,'2015-01-07 12:02:15',0,0,'AUD'),(12,'Bahamian Dollar',0,'2015-01-07 12:02:15',0,0,'BSD'),(13,'Bahraini Dinar',0,'2015-01-07 12:02:15',0,0,'BHD'),(14,'Bangladeshi Taka',0,'2015-01-07 12:02:15',0,0,'BDT'),(15,'Barbados Dollar',0,'2015-01-07 12:02:15',0,0,'BBD'),(16,'Belize Dollar',0,'2015-01-07 12:02:15',0,0,'BZD'),(17,'Bermudian Dollar',0,'2015-01-07 12:02:15',0,0,'BMD'),(18,'Bhutan Ngultrum',0,'2015-01-07 12:02:15',0,0,'BTN'),(19,'Bolivian Boliviano',0,'2015-01-07 12:02:15',0,0,'BOB'),(20,'Botswanian Pula',0,'2015-01-07 12:02:15',0,0,'BWP'),(21,'Brazilian Real',0,'2015-01-07 12:02:15',0,0,'BRL'),(22,'British Pound',0,'2015-01-07 12:02:15',0,0,'GBP'),(23,'Brunei Dollar',0,'2015-01-07 12:02:15',0,0,'BND'),(24,'Bulgarian Lev',0,'2015-01-07 12:02:15',0,0,'BGN'),(25,'Burma Kyat',0,'2015-01-07 12:02:15',0,0,'BUK'),(26,'Burundi Franc',0,'2015-01-07 12:02:15',0,0,'BIF'),(27,'Canadian Dollar',0,'2015-01-07 12:02:15',0,0,'CAD'),(28,'Cape Verde Escudo',0,'2015-01-07 12:02:15',0,0,'CVE'),(29,'Cayman Islands Dollar',0,'2015-01-07 12:02:15',0,0,'KYD'),(30,'Chilean Peso',0,'2015-01-07 12:02:15',0,0,'CLP'),(31,'Chilean Unidades de Fomento',0,'2015-01-07 12:02:15',0,0,'CLF'),(32,'Colombian Peso',0,'2015-01-07 12:02:15',0,0,'COP'),(33,'F Africaine BCEAO - Francs',0,'2015-01-07 12:02:15',0,0,'XOF'),(34,'F Africaine BEAC, Francs',0,'2015-01-07 12:02:15',0,0,'XAF'),(35,'Comoros Franc',0,'2015-01-07 12:02:15',0,0,'KMF'),(36,'Comptoirs Français du Pacifique Francs',0,'2015-01-07 12:02:15',0,0,'XPF'),(37,'Costa Rican Colon',0,'2015-01-07 12:02:15',0,0,'CRC'),(38,'Cuban Peso',0,'2015-01-07 12:02:15',0,0,'CUP'),(39,'Cyprus Pound',0,'2015-01-07 12:02:15',0,0,'CYP'),(40,'Czech Republic Koruna',0,'2015-01-07 12:02:15',0,0,'CZK'),(41,'Danish Krone',0,'2015-01-07 12:02:15',0,0,'DKK'),(42,'Democratic Yemeni Dinar',0,'2015-01-07 12:02:15',0,0,'YDD'),(43,'Dominican Peso',0,'2015-01-07 12:02:15',0,0,'DOP'),(44,'East Caribbean Dollar',0,'2015-01-07 12:02:15',0,0,'XCD'),(45,'East Timor Escudo',0,'2015-01-07 12:02:15',0,0,'TPE'),(46,'Ecuador Sucre',0,'2015-01-07 12:02:15',0,0,'ECS'),(47,'Egyptian Pound',0,'2015-01-07 12:02:15',0,0,'EGP'),(48,'El Salvador Colon',0,'2015-01-07 12:02:15',0,0,'SVC'),(49,'Estonian Kroon (EEK)',0,'2015-01-07 12:02:15',0,0,'EEK'),(50,'Ethiopian Birr',0,'2015-01-07 12:02:15',0,0,'ETB'),(51,'Euro',0,'2015-01-07 12:02:15',0,0,'EUR'),(52,'Falkland Islands Pound',0,'2015-01-07 12:02:15',0,0,'FKP'),(53,'Fiji Dollar',0,'2015-01-07 12:02:15',0,0,'FJD'),(54,'Gambian Dalasi',0,'2015-01-07 12:02:15',0,0,'GMD'),(55,'Ghanaian Cedi',0,'2015-01-07 12:02:15',0,0,'GHC'),(56,'Gibraltar Pound',0,'2015-01-07 12:02:15',0,0,'GIP'),(57,'Gold, Ounces',0,'2015-01-07 12:02:15',0,0,'XAU'),(58,'Guatemalan Quetzal',0,'2015-01-07 12:02:15',0,0,'GTQ'),(59,'Guinea Franc',0,'2015-01-07 12:02:15',0,0,'GNF'),(60,'Guinea-Bissau Peso',0,'2015-01-07 12:02:15',0,0,'GWP'),(61,'Guyanan Dollar',0,'2015-01-07 12:02:15',0,0,'GYD'),(62,'Haitian Gourde',0,'2015-01-07 12:02:15',0,0,'HTG'),(63,'Honduran Lempira',0,'2015-01-07 12:02:15',0,0,'HNL'),(64,'Hong Kong Dollar',0,'2015-01-07 12:02:15',0,0,'HKD'),(65,'Hungarian Forint',0,'2015-01-07 12:02:15',0,0,'HUF'),(66,'Indian Rupee',0,'2015-01-07 12:02:15',0,0,'INR'),(67,'Indonesian Rupiah',0,'2015-01-07 12:02:15',0,0,'IDR'),(68,'International Monetary Fund (IMF) Special Drawing ',0,'2015-01-07 12:02:15',0,0,'XDR'),(69,'Iranian Rial',0,'2015-01-07 12:02:15',0,0,'IRR'),(70,'Iraqi Dinar',0,'2015-01-07 12:02:15',0,0,'IQD'),(71,'Irish Punt',0,'2015-01-07 12:02:15',0,0,'IEP'),(72,'Israeli Shekel',0,'2015-01-07 12:02:15',0,0,'ILS'),(73,'Jamaican Dollar',0,'2015-01-07 12:02:15',0,0,'JMD'),(74,'Japanese Yen',0,'2015-01-07 12:02:15',0,0,'JPY'),(75,'Jordanian Dinar',0,'2015-01-07 12:02:15',0,0,'JOD'),(76,'Kampuchean (Cambodian) Riel',0,'2015-01-07 12:02:15',0,0,'KHR'),(77,'Kenyan Schilling',0,'2015-01-07 12:02:15',0,0,'KES'),(78,'Kuwaiti Dinar',0,'2015-01-07 12:02:15',0,0,'KWD'),(79,'Lao Kip',0,'2015-01-07 12:02:15',0,0,'LAK'),(80,'Lebanese Pound',0,'2015-01-07 12:02:15',0,0,'LBP'),(81,'Lesotho Loti',0,'2015-01-07 12:02:15',0,0,'LSL'),(82,'Liberian Dollar',0,'2015-01-07 12:02:15',0,0,'LRD'),(83,'Libyan Dinar',0,'2015-01-07 12:02:15',0,0,'LYD'),(84,'Macau Pataca',0,'2015-01-07 12:02:15',0,0,'MOP'),(85,'Malagasy Franc',0,'2015-01-07 12:02:15',0,0,'MGF'),(86,'Malawi Kwacha',0,'2015-01-07 12:02:15',0,0,'MWK'),(87,'Malaysian Ringgit',0,'2015-01-07 12:02:15',0,0,'MYR'),(88,'Maldive Rufiyaa',0,'2015-01-07 12:02:15',0,0,'MVR'),(89,'Maltese Lira',0,'2015-01-07 12:02:15',0,0,'MTL'),(90,'Mauritanian Ouguiya',0,'2015-01-07 12:02:15',0,0,'MRO'),(91,'Mauritius Rupee',0,'2015-01-07 12:02:15',0,0,'MUR'),(92,'Mexican Peso',0,'2015-01-07 12:02:15',0,0,'MXP'),(93,'Mongolian Tugrik',0,'2015-01-07 12:02:15',0,0,'MNT'),(94,'Moroccan Dirham',0,'2015-01-07 12:02:15',0,0,'MAD'),(95,'Mozambique Metical',0,'2015-01-07 12:02:15',0,0,'MZM'),(96,'Namibian Dollar',0,'2015-01-07 12:02:15',0,0,'NAD'),(97,'Nepalese Rupee',0,'2015-01-07 12:02:15',0,0,'NPR'),(98,'Netherlands Antillian Guilder',0,'2015-01-07 12:02:15',0,0,'ANG'),(99,'New Yugoslavia Dinar',0,'2015-01-07 12:02:15',0,0,'YUD'),(100,'New Zealand Dollar',0,'2015-01-07 12:02:15',0,0,'NZD'),(101,'Nicaraguan Cordoba',0,'2015-01-07 12:02:15',0,0,'NIO'),(102,'Nigerian Naira',0,'2015-01-07 12:02:15',0,0,'NGN'),(103,'North Korean Won',0,'2015-01-07 12:02:15',0,0,'KPW'),(104,'Norwegian Kroner',0,'2015-01-07 12:02:15',0,0,'NOK'),(105,'Omani Rial',0,'2015-01-07 12:02:15',0,0,'OMR'),(106,'Pakistan Rupee',0,'2015-01-07 12:02:15',0,0,'PKR'),(107,'Palladium Ounces',0,'2015-01-07 12:02:15',0,0,'XPD'),(108,'Panamanian Balboa',0,'2015-01-07 12:02:15',0,0,'PAB'),(109,'Papua New Guinea Kina',0,'2015-01-07 12:02:15',0,0,'PGK'),(110,'Paraguay Guarani',0,'2015-01-07 12:02:15',0,0,'PYG'),(111,'Peruvian Nuevo Sol',0,'2015-01-07 12:02:15',0,0,'PEN'),(112,'Philippine Peso',0,'2015-01-07 12:02:15',0,0,'PHP'),(113,'Platinum, Ounces',0,'2015-01-07 12:02:15',0,0,'XPT'),(114,'Polish Zloty',0,'2015-01-07 12:02:15',0,0,'PLN'),(115,'Qatari Rial',0,'2015-01-07 12:02:15',0,0,'QAR'),(116,'Romanian Leu',0,'2015-01-07 12:02:15',0,0,'RON'),(117,'Russian Ruble',0,'2015-01-07 12:02:15',0,0,'RUB'),(118,'Rwanda Franc',0,'2015-01-07 12:02:15',0,0,'RWF'),(119,'Samoan Tala',0,'2015-01-07 12:02:15',0,0,'WST'),(120,'Sao Tome and Principe Dobra',0,'2015-01-07 12:02:15',0,0,'STD'),(121,'Saudi Arabian Riyal',0,'2015-01-07 12:02:15',0,0,'SAR'),(122,'Seychelles Rupee',0,'2015-01-07 12:02:15',0,0,'SCR'),(123,'Sierra Leone Leone',0,'2015-01-07 12:02:15',0,0,'SLL'),(124,'Silver, Ounces',0,'2015-01-07 12:02:15',0,0,'XAG'),(125,'Singapore Dollar',0,'2015-01-07 12:02:15',0,0,'SGD'),(126,'Slovak Koruna',0,'2015-01-07 12:02:15',0,0,'SKK'),(127,'Solomon Islands Dollar',0,'2015-01-07 12:02:15',0,0,'SBD'),(128,'Somali Schilling',0,'2015-01-07 12:02:15',0,0,'SOS'),(129,'South African Rand',0,'2015-01-07 12:02:15',0,0,'ZAR'),(130,'Sri Lanka Rupee',0,'2015-01-07 12:02:15',0,0,'LKR'),(131,'St. Helena Pound',0,'2015-01-07 12:02:15',0,0,'SHP'),(132,'Sudanese Pound',0,'2015-01-07 12:02:15',0,0,'SDP'),(133,'Suriname Guilder',0,'2015-01-07 12:02:15',0,0,'SRG'),(134,'Swaziland Lilangeni',0,'2015-01-07 12:02:15',0,0,'SZL'),(135,'Swedish Krona',0,'2015-01-07 12:02:15',0,0,'SEK'),(136,'Swiss Franc',0,'2015-01-07 12:02:15',0,0,'CHF'),(137,'Syrian Potmd',0,'2015-01-07 12:02:15',0,0,'SYP'),(138,'Taiwan Dollar',0,'2015-01-07 12:02:15',0,0,'TWD'),(139,'Tanzanian Schilling',0,'2015-01-07 12:02:15',0,0,'TZS'),(140,'Thai Baht',0,'2015-01-07 12:02:15',0,0,'THB'),(141,'Tongan Paanga',0,'2015-01-07 12:02:15',0,0,'TOP'),(142,'Trinidad and Tobago Dollar',0,'2015-01-07 12:02:15',0,0,'TTD'),(143,'Tunisian Dinar',0,'2015-01-07 12:02:15',0,0,'TND'),(144,'Turkish Lira',0,'2015-01-07 12:02:15',0,0,'TRY'),(145,'Uganda Shilling',0,'2015-01-07 12:02:15',0,0,'UGX'),(146,'United Arab Emirates Dirham',0,'2015-01-07 12:02:15',0,0,'AED'),(147,'Uruguayan Peso',0,'2015-01-07 12:02:15',0,0,'UYU'),(148,'US Dollar',0,'2015-01-07 12:02:15',0,0,'USD'),(149,'Vanuatu Vatu',0,'2015-01-07 12:02:15',0,0,'VUV'),(150,'Venezualan Bolivar',0,'2015-01-07 12:02:15',0,0,'VEF'),(151,'Vietnamese Dong',0,'2015-01-07 12:02:15',0,0,'VND'),(152,'Yemeni Rial',0,'2015-01-07 12:02:15',0,0,'YER'),(153,'Yuan (Chinese) Renminbi',0,'2015-01-07 12:02:15',0,0,'CNY'),(154,'Zaire Zaire',0,'2015-01-07 12:02:15',0,0,'ZRZ'),(155,'Zambian Kwacha',0,'2015-01-07 12:02:15',0,0,'ZMK'),(156,'Zimbabwe Dollar',0,'2015-01-07 12:02:15',0,0,'ZWD');

/*Table structure for table `employees` */

DROP TABLE IF EXISTS `employees`;

CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL,
  `branchid` int(11) NOT NULL,
  `franchiseid` int(11) NOT NULL,
  `isdeleted` tinyint(2) NOT NULL,
  `isactivated` tinyint(2) NOT NULL,
  `createdon` datetime NOT NULL,
  `createdby` int(11) NOT NULL,
  `lastlogined` datetime NOT NULL,
  `ip` varchar(20) NOT NULL,
  `modifiedby` int(11) NOT NULL,
  `image` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `about` text NOT NULL,
  `type` varchar(50) DEFAULT 'P',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

/*Data for the table `employees` */

insert  into `employees`(`id`,`firstname`,`lastname`,`phone`,`email`,`password`,`branchid`,`franchiseid`,`isdeleted`,`isactivated`,`createdon`,`createdby`,`lastlogined`,`ip`,`modifiedby`,`image`,`address`,`about`,`type`) values (15,'Loc','Loc21','0921999999','loc@gmail.com','pas',1,0,0,0,'0000-00-00 00:00:00',0,'0000-00-00 00:00:00','',0,'','Address 1','Abdul Wakeel','P'),(16,'Pter','Smith','088912929','peter@gmail.com','wogario',1,0,0,0,'0000-00-00 00:00:00',0,'0000-00-00 00:00:00','',0,'','address','Looking awesome','P'),(18,'Abdul','Wakeel','03929292','itsprogrammer@gmail.com','Passwordtext',1,0,0,0,'0000-00-00 00:00:00',0,'0000-00-00 00:00:00','',0,'','G8','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc placerat diam quis nisl vestibulum dignissim. In hac habitasse platea dictumst. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam placerat nunc ut tellus tristique, non posuere neque iaculis.','Full Time'),(19,'Aftab','Ahmed','0092111111','itsprogrammer@gmail.com','wakeel123',1,0,0,0,'0000-00-00 00:00:00',0,'0000-00-00 00:00:00','',0,'','G8 Markaz','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc placerat diam quis nisl vestibulum dignissim. In hac habitasse platea dictumst. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam placerat nunc ut tellus tristique, non posuere neque iaculis.','Full Time');

/*Table structure for table `employeesschedule` */

DROP TABLE IF EXISTS `employeesschedule`;

CREATE TABLE `employeesschedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) DEFAULT NULL,
  `isdeleted` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `employeesschedule` */

/*Table structure for table `franchises` */

DROP TABLE IF EXISTS `franchises`;

CREATE TABLE `franchises` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `packageid` int(11) NOT NULL,
  `ownerid` int(11) NOT NULL,
  `isactivated` tinyint(2) NOT NULL,
  `isdeleted` tinyint(2) NOT NULL,
  `createdon` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdby` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `franchises` */

insert  into `franchises`(`id`,`name`,`packageid`,`ownerid`,`isactivated`,`isdeleted`,`createdon`,`createdby`) values (1,'Khurram Ali',1,1,0,0,'2015-01-03 11:53:13',1);

/*Table structure for table `jobtypes` */

DROP TABLE IF EXISTS `jobtypes`;

CREATE TABLE `jobtypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `comments` varchar(200) NOT NULL,
  `createdon` datetime NOT NULL,
  `isdeleted` tinyint(2) NOT NULL,
  `createdby` int(11) NOT NULL,
  `branchid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

/*Data for the table `jobtypes` */

insert  into `jobtypes`(`id`,`name`,`comments`,`createdon`,`isdeleted`,`createdby`,`branchid`) values (27,'Hair Dressors','dress','0000-00-00 00:00:00',0,0,1);

/*Table structure for table `jobtypesschedule` */

DROP TABLE IF EXISTS `jobtypesschedule`;

CREATE TABLE `jobtypesschedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jobtypes_id` int(11) DEFAULT NULL,
  `isdeleted` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `jobtypesschedule` */

/*Table structure for table `languages` */

DROP TABLE IF EXISTS `languages`;

CREATE TABLE `languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL,
  `createdon` datetime NOT NULL,
  `isdeleted` tinyint(4) NOT NULL,
  `isactive` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `languages` */

insert  into `languages`(`id`,`title`,`createdon`,`isdeleted`,`isactive`) values (1,'English','2014-12-31 00:00:00',0,1),(2,'French','2014-12-31 00:00:00',1,0);

/*Table structure for table `languagetranslate` */

DROP TABLE IF EXISTS `languagetranslate`;

CREATE TABLE `languagetranslate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `languageid` varchar(64) NOT NULL,
  `title` varchar(64) NOT NULL,
  `languagetitle` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;

/*Data for the table `languagetranslate` */

insert  into `languagetranslate`(`id`,`languageid`,`title`,`languagetitle`) values (5,'2','dashboard','dasheebords'),(17,'','add','Add new Item'),(24,'1','activate','Activate'),(25,'1','edit','Edit'),(26,'1','add','Add new'),(28,'1','SSS','SSS'),(31,'1','departments','Departments'),(32,'1','delete','Delete'),(33,'1','dashboard','Dashboard'),(34,'1','dashboards','Dashboard'),(35,'1','branches','Departments'),(36,'1','language','Languages'),(37,'1','jobtypes','Job types'),(38,'1','dashboard','123'),(39,'1','successalert','Success!'),(40,'1','erroralert','Boo!'),(41,'1','successtext','Record has been saved successfuly'),(42,'1','errortext','There is an error while saving the record'),(43,'1','services','Services'),(44,'1','abc','abc');

/*Table structure for table `packages` */

DROP TABLE IF EXISTS `packages`;

CREATE TABLE `packages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `monthlyprice` varchar(20) NOT NULL,
  `createdon` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isdeleted` tinyint(2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `packages` */

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `products` */

/*Table structure for table `schedule` */

DROP TABLE IF EXISTS `schedule`;

CREATE TABLE `schedule` (
  `id` int(22) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `start` datetime DEFAULT NULL,
  `employeeid` int(11) DEFAULT NULL,
  `createdby` time DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `employeescheduleid` int(11) DEFAULT NULL,
  `jobtypesscheduleid` int(11) DEFAULT NULL,
  `branchid` int(11) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Data for the table `schedule` */

insert  into `schedule`(`id`,`date`,`start`,`employeeid`,`createdby`,`end`,`employeescheduleid`,`jobtypesscheduleid`,`branchid`,`title`) values (1,'2015-01-07','2015-01-07 00:00:12',1,NULL,'2015-01-07 00:00:09',1,1,1,'All Day working'),(2,'2015-01-08','2015-01-07 12:00:00',2,NULL,'2015-01-07 18:00:00',2,2,1,'All Day working');

/*Table structure for table `services` */

DROP TABLE IF EXISTS `services`;

CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `comments` text NOT NULL,
  `createdby` int(11) NOT NULL,
  `isdeleted` tinyint(2) NOT NULL,
  `createdon` datetime NOT NULL,
  `branchid` int(11) NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'bookable',
  `time` tinyint(2) DEFAULT NULL,
  `price` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

/*Data for the table `services` */

insert  into `services`(`id`,`name`,`comments`,`createdby`,`isdeleted`,`createdon`,`branchid`,`type`,`time`,`price`) values (14,'Manage Employees','employees management',0,0,'0000-00-00 00:00:00',1,'bookable',NULL,NULL),(15,'Services','Services',0,0,'0000-00-00 00:00:00',1,'bookable',NULL,NULL),(18,'Services 31','Services 31',0,0,'0000-00-00 00:00:00',1,'bookable',NULL,NULL);

/*Table structure for table `timings` */

DROP TABLE IF EXISTS `timings`;

CREATE TABLE `timings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `opened` varchar(20) NOT NULL,
  `closed` varchar(20) NOT NULL,
  `isdeleted` tinyint(2) NOT NULL,
  `createdon` datetime NOT NULL,
  `branchid` int(11) DEFAULT NULL,
  `day` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;

/*Data for the table `timings` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `userid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Primary Key: Unique user ID.',
  `name` varchar(60) NOT NULL DEFAULT '' COMMENT 'Unique user name.',
  `password` varchar(128) NOT NULL DEFAULT '' COMMENT 'User’s password (hashed).',
  `mail` varchar(254) DEFAULT '' COMMENT 'User’s e-mail address.',
  `created` int(11) NOT NULL DEFAULT '0' COMMENT 'Timestamp for when user was created.',
  `access` int(11) NOT NULL DEFAULT '0' COMMENT 'Timestamp for previous time user accessed the site.',
  `login` int(11) NOT NULL DEFAULT '0' COMMENT 'Timestamp for user’s last login.',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'Whether the user is active(1) or blocked(0).',
  PRIMARY KEY (`userid`),
  UNIQUE KEY `name` (`name`),
  KEY `access` (`access`),
  KEY `created` (`created`),
  KEY `mail` (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Stores user data.';

/*Data for the table `users` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
