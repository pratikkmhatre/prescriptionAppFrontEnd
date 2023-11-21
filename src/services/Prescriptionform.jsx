import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import {
  redirect,
  useNavigate,
} from "react-router-dom/dist/umd/react-router-dom.development";
import { NavLink } from "react-router-dom";
const { format } = require("date-fns");
export default function Prescriptionform() {
  const [doctorName, setDoctorName] = useState([]);
  const [pathname, setPathName] = useState([]);
  const [care, setCare] = useState([]);
  const [medicines, setMedicine] = useState([]);
  const [patientName, setPatientName] = useState([]);
  const location = window.location.pathname;
  const navigate = useNavigate();
  //JWT verify
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
  const token = localStorage.getItem("doctorId");
  const decodeToken = parseJwt(token);
  const doctorId = decodeToken.doctorId;
  const doctor = decodeToken.name;

  useEffect(() => {
    if (location) {
      let tmp = window.location.pathname.slice(
        window.location.pathname.lastIndexOf("/"),
        window.location.pathname.length
      );
      setPathName(tmp);
    }
  }, [location]);

  //get doctor details
  useEffect(() => {
    fetch("https://plum-drab-fly.cyclic.app/doctor/getdetails/" + doctorId)
      .then((response) => response.json())
      .then((data) => {
        setDoctorName(data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //new precriptions
  function createPrescription() {
    let data = JSON.stringify({
      care,
      medicines,
      doctor,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://plum-drab-fly.cyclic.app/doctor/prescriptions" + pathname,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        alert(response.data.message);
        navigate("/doctor/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div>
      <NavLink
        className="link"
        onClick={(e) => {
          e?.preventDefault();

          navigate("/doctor/dashboard");
        }}
      >
        Dashboard
      </NavLink>

      <section
        style={{
          textAlign: "center",
          width: "40%",
          marginLeft: "30%",
          marginTop: "8%",
          border: "1px solid black",
        }}
      >
        <div>
          <h5 style={{ marginTop: "2%", marginRight: "65%" }}>
            <strong>
              <em> {doctorName}</em>
            </strong>
          </h5>
        </div>
        <div style={{ marginRight: "65%" }}>
          <h5>{format(new Date(), "dd.MM.yyyy")}</h5>
        </div>

        <form style={{ marginLeft: "10%" }}>
          <div class="form-group">
            <label for="exampleFormControlTextarea1">Example textarea</label>
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              placeholder="Care to be taken"
              onChange={(e) => setCare(e.target.value)}
            ></textarea>
          </div>
          <div class="form-group">
            <label for="exampleFormControlTextarea1">Example textarea</label>
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              placeholder="Medicines"
              onChange={(e) => setMedicine(e.target.value)}
            ></textarea>
          </div>
          <div style={{ textAlign: "center", marginLeft: "45%" }}>
            <p>Doctor's Signature</p>
            <p>{doctorName}</p>
          </div>
          <div style={{ marginRight: "20%" }}>
            <button
              className="btn btn-success btn-sm m-1"
              onClick={(e) => {
                e?.preventDefault();
                createPrescription();
              }}
            >
              Generate Prescription
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
