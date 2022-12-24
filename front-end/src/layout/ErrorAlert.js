import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {
  if (!error || error.length < 1) {
    return null;
  } else if (Array.isArray(error)) {
    let message = [];
    error.forEach((e) => {
      message.push(e.message);
    });
    message = message.join(" and ");
    return (
      error && <div className="alert alert-danger m-2">Error: {message}</div>
    );
  } else {
    return (
      error && (
        <div className="alert alert-danger m-2">Error: {error.message}</div>
      )
    );
  }
}

export default ErrorAlert;
