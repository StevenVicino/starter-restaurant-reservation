import React, { useState } from "react";
import { listReservations } from "../utils/api";
import { Link } from "react-router-dom";

function Search() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [response, setResponse] = useState("");

  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    listReservations({ mobile_number: mobileNumber }).then(setReservations);
    setResponse("No reservations found");
  };

  const reservationList =
    reservations.length < 1 ? (
      <div>{response}</div>
    ) : (
      <ul>
        {reservations.map((reservation) => {
          return (
            <li key={reservation.reservation_id}>
              <div className="row">
                <div className="col">{reservation.first_name}</div>
                <div className="col">{reservation.last_name}</div>
                <div className="col">{reservation.mobile_number}</div>
                <div className="col">{reservation.reservation_date}</div>
                <div className="col">{reservation.reservation_time}</div>
                <div className="col">{reservation.people}</div>
                {reservation.status === "booked" ? (
                  <Link
                    className="button"
                    to={`/reservations/${reservation.reservation_id}/edit`}
                  >
                    Edit{" "}
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mobile_number">
          Enter Telephone Number:
          <input
            id="mobile_number"
            type="telephone"
            name="mobile_number"
            onChange={handleChange}
            value={mobileNumber}
            placeholder="Enter a customer's phone number"
          />
        </label>
        <button onClick={handleSubmit}>Find</button>
      </form>
      <br />
      <div>{reservationList}</div>
    </div>
  );
}

export default Search;
