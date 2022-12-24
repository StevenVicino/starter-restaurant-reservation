import React, { useState } from "react";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import reservationCreateValidation from "./reservationCreateValidation";

function ReservationsNew() {
  const history = useHistory();
  const initialReservation = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState({ ...initialReservation });
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const errors = reservationCreateValidation(formData);
    if (errors.length) {
      setError(errors);
    } else {
      createReservation(formData, abortController.signal)
        .then(() => {
          history.push(`/dashboard?date=${formData.reservation_date}`);
        })
        .catch(setError);
    }
    return () => abortController.abort();
  };

  const handleChange = ({ target }) =>
    setFormData({
      ...formData,
      [target.name]:
        target.name === "people" && target.value
          ? Number(target.value)
          : target.value,
    });

  return (
    <div>
      <ErrorAlert error={error} />
      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        reservations={initialReservation}
      />
    </div>
  );
}

export default ReservationsNew;
