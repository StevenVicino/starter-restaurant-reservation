import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({
  formData,
  handleChange,
  handleSubmit,
  reservations,
}) {
  const history = useHistory();

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="first_name">
        Please Enter Your First Name:
        <input
          id="first_name"
          type="text"
          name="first_name"
          onChange={handleChange}
          value={formData.first_name}
          placeholder={reservations.first_name}
        />
      </label>
      <br />
      <label htmlFor="last_name">
        Please Enter Your Last Name:
        <input
          id="last_name"
          type="text"
          name="last_name"
          onChange={handleChange}
          value={formData.last_name}
          placeholder={reservations.last_name}
        />
      </label>
      <br />
      <label htmlFor="mobile_number">
        Please Enter Your Phone Number:
        <input
          id="mobile_number"
          type="number"
          name="mobile_number"
          onChange={handleChange}
          value={formData.mobile_number}
          placeholder={reservations.mobile_number}
        />
      </label>
      <br />
      <label htmlFor="reservation_date">
        Please Enter Your Reservation Date:
        <input
          id="reservation_date"
          type="date"
          name="reservation_date"
          onChange={handleChange}
          value={formData.reservation_date}
          placeholder={reservations.reservation_date}
        />
      </label>
      <br />
      <label htmlFor="reservation_time">
        Please Enter The Time You Would Like to Reserve:
        <input
          id="reservation_time"
          type="time"
          name="reservation_time"
          onChange={handleChange}
          value={formData.reservation_time}
          placeholder={reservations.reservation_time}
        />
      </label>
      <br />
      <label htmlFor="people">
        Please Enter the Number of Guests In Your Party:
        <input
          id="people"
          type="number"
          name="people"
          onChange={handleChange}
          value={formData.people}
          placeholder={reservations.people}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
      <button type="cancel" onClick={() => history.go(-1)}>
        Cancel
      </button>
    </form>
  );
}

export default ReservationForm;
