-- --------------------------------------------------------

--
-- Table structure for table `maps`
--

CREATE TABLE IF NOT EXISTS `maps` (
  `mapid` int(11) NOT NULL AUTO_INCREMENT,
  `mapdata` text NOT NULL,
  PRIMARY KEY (`mapid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `position`
--

CREATE TABLE IF NOT EXISTS `position` (
  `posid` int(11) NOT NULL AUTO_INCREMENT,
  `xpos` int(11) NOT NULL,
  `ypos` int(11) NOT NULL,
  PRIMARY KEY (`posid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `position`
--

INSERT INTO `position` (`posid`, `xpos`, `ypos`) VALUES
(1, 17, 10); 
