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
      <ErrorAlert error={error} />
      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        reservations={reservations}
      />
    </div>
  );

  // return (
  //   <div>
  //     <ErrorAlert error={error} />
  //     <form onSubmit={handleSubmit}>
  //       <label htmlFor="first_name">
  //         Please Enter Your First Name:
  //         <input
  //           id="first_name"
  //           type="text"
  //           name="first_name"
  //           placeholder={reservations.first_name}
  //           onChange={handleChange}
  //           value={formData.first_name}
  //         />
  //       </label>
  //       <br />
  //       <label htmlFor="last_name">
  //         Please Enter Your Last Name:
  //         <input
  //           id="last_name"
  //           type="text"
  //           name="last_name"
  //           placeholder={reservations.last_name}
  //           onChange={handleChange}
  //           value={formData.last_name}
  //         />
  //       </label>
  //       <br />
  //       <label htmlFor="mobile_number">
  //         Please Enter Your Phone Number Without Spaces or Dashes:
  //         <input
  //           id="mobile_number"
  //           type="number"
  //           name="mobile_number"
  //           placeholder={reservations.mobile_number}
  //           onChange={handleChange}
  //           value={formData.mobile_number}
  //         />
  //       </label>
  //       <br />
  //       <label htmlFor="reservation_date">
  //         Please Enter Your Reservation Date YY/MM/DD:
  //         <input
  //           id="reservation_date"
  //           type="date"
  //           name="reservation_date"
  //           placeholder={reservations.reservation_date}
  //           onChange={handleChange}
  //           value={formData.reservation_date}
  //         />
  //       </label>
  //       <br />
  //       <label htmlFor="reservation_time">
  //         Please Enter The Time You Would Like to Reserve:
  //         <input
  //           id="reservation_time"
  //           type="time"
  //           name="reservation_time"
  //           placeholder={reservations.reservation_time}
  //           onChange={handleChange}
  //           value={formData.reservation_time}
  //         />
  //       </label>
  //       <br />
  //       <label htmlFor="people">
  //         Please Enter the Number of Guests In Your Party:
  //         <input
  //           id="people"
  //           type="number"
  //           name="people"
  //           placeholder={reservations.people}
  //           onChange={handleChange}
  //           value={formData.people}
  //         />
  //       </label>
  //       <br />
  //       <button type="submit">Submit</button>
  //       <button type="cancel" onClick={() => history.go(-1)}>
  //         Cancel
  //       </button>
  //     </form>
  //   </div>
  // );
}

export default ReservationsEdit;
