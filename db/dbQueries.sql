
-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) NOT NULL,
  `property_id` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `num_of_guests` int(10) NOT NULL,
  `checkin_date` date NOT NULL,
  `checkout_date` date NOT NULL,
  `booking_id` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `country_code` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_id_2` (`booking_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `checkin_date` (`checkin_date`),
  ADD KEY `checkout_date` (`checkout_date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
COMMIT;



-- --------------------------------------------------------

--
-- Stored procedure for booking a property
--



CREATE PROCEDURE `bookProperty`(IN rPropertyId VARCHAR(150),IN rNumOfGuests INT(10), IN rCheckinDate DATE, IN rCheckoutDate DATE, IN rFirstName VARCHAR(50), IN rLastName VARCHAR(50), IN rEmail VARCHAR(100), IN rCountryCode VARCHAR(10), IN rContactNumber VARCHAR(11))
BEGIN
    DECLARE rBookingId VARCHAR(150);
    DECLARE isPropertyBooked INT(10);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
      ROLLBACK;
      SHOW ERRORS;
    END;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    SET sql_mode = NO_ENGINE_SUBSTITUTION;

    START TRANSACTION;
    SELECT count(id) into isPropertyBooked FROM bookings WHERE checkout_date >= rCheckinDate and checkin_date <= rCheckoutDate;
    IF (isPropertyBooked = 0)
    THEN
      set rBookingId = CONCAT('BK',DATE_FORMAT(NOW(),'%Y%m%d%H%i%s'),CEILING(RAND()*10000));
      INSERT INTO `bookings`( `property_id`, `num_of_guests`, `checkin_date`, `checkout_date`, `booking_id`, `first_name`, `last_name`, `email`, `country_code`, `contact_number`, `created_at`) VALUES (rPropertyId,rNumOfGuests,rCheckinDate,rCheckoutDate,rBookingId,rFirstName, rLastName, rEmail, rCountryCode, rContactNumber, now());
      SELECT 1 as success, rBookingId;
      ELSE
      SELECT 0 as success;
    END IF;
    COMMIT;
  END

