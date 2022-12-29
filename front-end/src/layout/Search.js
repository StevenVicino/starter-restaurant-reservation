import React, { useState } from "react";
import { editReservationStatus, listReservations } from "../utils/api";
import { Link, useHistory } from "react-router-dom";

function Search() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [response, setResponse] = useState("");

  const history = useHistory();

  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  };
  //Makes an API for the reservations that match the mobile number
  const handleSubmit = (event) => {
    event.preventDefault();
    listReservations({ mobile_number: mobileNumber }).then(setReservations);
    setResponse("No reservations found");
  };
  //Sets reservation status to cancelled
  async function handleCancel(reservationId) {
    const abortController = new AbortController();
    const result = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (result) {
      await editReservationStatus(
        "cancelled",
        reservationId,
        abortController.signal
      );
      history.go("/search");
    }
    return () => abortController.abort();
  }
  //Creates Reservation Table
  const reservationList =
    reservations.length < 1 ? (
      <div>{response}</div>
    ) : (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>First Name:</th>
              <th>Last Name:</th>
              <th>Phone Number:</th>
              <th>Date:</th>
              <th>Time:</th>
              <th>Guest Number:</th>
              <th>Status:</th>
              <th>Seat:</th>
              <th>Edit:</th>
              <th>Cancel:</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => {
              return (
                <tr key={reservation.reservation_id}>
                  <td className="align-middle">{reservation.first_name}</td>
                  <td className="align-middle">{reservation.last_name}</td>
                  <td className="align-middle">{reservation.mobile_number}</td>
                  <td className="align-middle">
                    {reservation.reservation_date}
                  </td>
                  <td className="align-middle">
                    {reservation.reservation_time}
                  </td>
                  <td className="align-middle">{reservation.people}</td>
                  <td className="align-middle">{reservation.status}</td>
                  <td className="align-middle">
                    {reservation.status === "booked" ? (
                      <button>
                        <Link
                          type="button"
                          to={`/reservations/${reservation.reservation_id}/seat`}
                        >
                          Seat
                        </Link>
                      </button>
                    ) : null}
                  </td>
                  <td className="align-middle">
                    {reservation.status === "booked" ? (
                      <button>
                        <Link
                          className="link-dark"
                          to={`/reservations/${reservation.reservation_id}/edit`}
                        >
                          Edit
                        </Link>
                      </button>
                    ) : null}
                  </td>
                  <td className="align-middle">
                    {reservation.status === "cancelled" ? null : (
                      <button
                        type="button"
                        data-reservation-id-cancel={reservation.reservation_id}
                        onClick={() => handleCancel(reservation.reservation_id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );

  return (
    <div>
      <h1 className="text-center bg-secondary">Search</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mobile_number" className="mr-3">
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
        <button onClick={handleSubmit} type="submit">
          Find
        </button>
      </form>
      <br />
      <div>{reservationList}</div>
    </div>
  );
}

export default Search;
