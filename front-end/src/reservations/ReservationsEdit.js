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
  const [formData, setFormData] = useState({ ...initialReservation });
  useEffect(() => {
    setError(null);
    async function fetchData() {
      const result = await readReservation(reservationId);
      result.reservation_time = result.reservation_time.slice(0, 5);
      setFormData(result);
    }
    fetchData();
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const errors = reservationEditValidation(formData);
    if (errors.length) {
      return setError(errors);
    }
    try {
      console.log(formData.reservation_time);
      await editReservation(formData, abortController.signal);
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setError(error);
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
        reservations={initialReservation}
      />
    </div>
  );
}

export default ReservationsEdit;
