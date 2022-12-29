function reservationCreateValidation(reservation) {
  const errors = [];
  const { reservation_date, reservation_time, people, status } = reservation;
  const props = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];
  props.forEach((prop) => {
    if (!reservation[prop]) {
      errors.push(new Error(`A ${prop} property is required.`));
    }
  });
  if (new Date(reservation_date) === "Invalid Date") {
    errors.push(new Error(`The reservation_date is an invalid date`));
  }
  const regexp = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);
  if (!regexp.test(reservation_time)) {
    errors.push(new Error(`The reservation_time is an invalid time`));
  }
  if (typeof people !== "number" || people < 1) {
    errors.push(new Error(`${people} is not a valid number of people`));
  }
  const day = new Date(reservation_date).getUTCDay();
  if (day === 2) {
    errors.push(new Error("Restaurant is closed on Tuesday"));
  }
  const hours = reservation_time.substring(0, 2);
  const min = reservation_time.substring(3, 5);
  if (
    hours < 11 ||
    (hours <= 10 && min < 30) ||
    hours >= 22 ||
    (hours >= 21 && min > 30)
  ) {
    errors.push(
      new Error(
        "The store is closed.  Please reserve your seat between 10:30am and 9:30pm."
      )
    );
  }
  const date = new Date(`${reservation_date}T${reservation_time}`);
  if (date < new Date()) {
    errors.push(new Error("Reservation must be in the future"));
  }
  if (status && status !== "booked") {
    errors.push(new Error(`Status must not be ${status}`));
  }
  return errors;
}

export default reservationCreateValidation;
