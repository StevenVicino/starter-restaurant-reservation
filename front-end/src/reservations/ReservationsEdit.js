import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { editReservation, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";
import reservationEditValidation from "./reservationEditValidation";

function ReservationsEdit() {
  const { reservationId } = useParams();

  const history = useHistory();

  const initialReservation = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    reservation_id: reservationId,
  };

  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState({ ...initialReservation });
  const [formData, setFormData] = useState({ ...reservations });

  useEffect(() => {
    async function defaultReservation() {
      const response = await readReservation(reservationId);
      setReservations(response);
    }
    defaultReservation();
  }, [reservationId]);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]:
        target.name === "people" && target.value
          ? Number(target.value)
          : target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const errors = reservationEditValidation(formData);
    if (errors.length) {
      setError(errors);
    } else {
      editReservation(formData, abortController.signal)
        .then(() => {
          history.go(-1);
        })
        .catch(setError);
    }
    return () => abortController.abort();
  };

  return (
    <div>
      <h1 className="text-center bg-secondary">Edit Reservation</h1>
      <ErrorAlert error={error} />
      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        reservations={reservations}
      />
    </div>
  );
}

export default ReservationsEdit;
