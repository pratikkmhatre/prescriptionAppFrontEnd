import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  redirect,
  useNavigate,
} from "react-router-dom/dist/umd/react-router-dom.development";

export default function Prescriptionlist() {
  const [prescriptions, setPrescriptions] = useState([]);
  const navigate = useNavigate();

  function parseJwt(tk) {
    var base64Url = tk.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  const patient = localStorage.getItem("patientId");
  let patientId;

  if (patient) {
    const decodeToken = parseJwt(patient);
    // console.log("decode", decodeToken);
    patientId = decodeToken.patientId;
    // console.log(decodeToken);
  }
  useEffect(() => {
    fetch("https://plum-drab-fly.cyclic.app/patient/prescriptions/" + patientId)
      .then((response) => response.json())
      .then((data) => {
        setPrescriptions(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <NavLink
        className="link"
        onClick={(e) => {
          e?.preventDefault();

          navigate("/patient/dashboard");
        }}
      >
        Dashboard
      </NavLink>
      <h1 className="text-center">My prescriptions</h1>
      <table
        className="table"
        style={{ width: "85%", border: "1px solid black", marginLeft: "5%" }}
      >
        <thead>
          <tr>
            <th className="col">Prescription ID</th>
            <th className="col">Doctor</th>
            <th className="col">Care to be taken</th>
            <th className="col">Medicines</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((d) => (
            <tr>
              <td scope="row">{d.id}</td>
              <td>{d.doctor}</td>
              <td>{d.care}</td>
              <td>{d.medicines}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
