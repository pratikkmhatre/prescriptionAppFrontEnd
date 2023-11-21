import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

import {
  redirect,
  useNavigate,
} from "react-router-dom/dist/umd/react-router-dom.development";

export default function Prescriptionlistdr() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [care, setCare] = useState([]);
  const [medicines, setMedicines] = useState([]);
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

  const doctor = localStorage.getItem("doctorId");
  let doctorName;

  if (doctor) {
    const decodeToken = parseJwt(doctor);
    // console.log("decode", decodeToken);
    doctorName = decodeToken.name;
    // console.log(decodeToken);
  }

  useEffect(() => {
    fetch("https://plum-drab-fly.cyclic.app/doctor/prescriptions/" + doctorName)
      .then((response) => response.json())
      .then((data) => {
        setPrescriptions(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function downloadPDF() {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://plum-drab-fly.cyclic.app/doctor/downloadprescription",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <section>
      <NavLink
        className="link"
        onClick={(e) => {
          e?.preventDefault();

          navigate("/doctor/dashboard");
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
            <th className="col">Patient ID</th>
            <th className="col">Care to be taken</th>
            <th className="col">Medicines</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((d) => (
            <tr>
              <td scope="row">{d.id}</td>
              <td>{d.patientId}</td>
              <td>{d.care}</td>
              <td>{d.medicines}</td>
              <td>
                <div>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={(e) => {
                      e?.preventDefault();

                      window.location.pathname = "/doctor/updateprescriptions";
                    }}
                  >
                    Edit
                  </button>
                </div>
              </td>
              <td>
                <div>
                  <button className="btn btn-success btn-sm">
                    <a
                      href="https://plum-drab-fly.cyclic.app/doctor/downloadprescription"
                      style={{ color: "white" }}
                    >
                      Download
                    </a>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <Prescriptionupdateform data={prescriptions} /> */}
    </section>
  );
}
