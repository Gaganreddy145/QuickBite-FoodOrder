import React from "react";
import { Link, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  let title = "The page which u have requested is unavailable";
  if (error.status === 404) {
    title = error.data.message || "The page which u have requested is unavailable";
  }

  return (
    <div>
      <h1>{title}</h1>
      <Link to="..">Back</Link>
    </div>
  );
}

export default ErrorPage;
