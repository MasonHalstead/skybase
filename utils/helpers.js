const handleDates = moment => {
  const date_now = moment.utc().format();
  const date_utc = moment.utc();
  const date_normalized = date_utc.startOf('minute');

  const minutes = date_utc.minute();
  const hours = date_utc.hour();

  const date_clone_m2 = date_normalized.clone();
  const date_clone_m5 = date_normalized.clone();
  const date_clone_m10 = date_normalized.clone();
  const date_clone_h1 = date_normalized.clone();
  const date_clone_d0 = date_normalized.clone();
  const date_clone_d1 = date_normalized.clone();

  return {
    date_now,
    minutes,
    hours,
    date_utc: date_utc.format(),
    date_clone_m2: date_clone_m2.subtract(2, 'minutes').format(),
    date_clone_m5: date_clone_m5.subtract(5, 'minutes').format(),
    date_clone_m10: date_clone_m10.subtract(10, 'minutes').format(),
    date_clone_h1: date_clone_h1.subtract(1, 'hours').format(),
    date_clone_d0: date_clone_d0.startOf('day').format(),
    date_clone_d1: date_clone_d1.subtract(1, 'days').format(),
  };
};

module.exports = { handleDates };
