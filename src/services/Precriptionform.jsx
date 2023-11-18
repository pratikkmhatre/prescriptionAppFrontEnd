import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
export default function Prescriptionform() {
  const [details, setDetails] = useState([]);
  const [pathname, setPathName] = useState([]);
  const [patientName, setPatientName] = useState([]);
  const location = window.location.pathname;
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

  useEffect(() => {
    if (location) {
      let tmp = window.location.pathname.slice(
        window.location.pathname.lastIndexOf("/"),
        window.location.pathname.length
      );
      setPathName(tmp);
    }
  }, [location]);

  window.addEventListener("DOMContentLoaded", (e) => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://plum-drab-fly.cyclic.app/doctor/getdetails/" + doctorId,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setDetails(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  return (
    <section style={{ textAlign: "center" }}>
      <h3>Prescription by {details.name}</h3>
      <form style={{ marginLeft: "30%" }}>
        <div class="form-group">
          <label for="exampleFormControlTextarea1">Example textarea</label>
          <textarea
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="Care to be taken"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="exampleFormControlTextarea1">Example textarea</label>
          <textarea
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="Medicines"
          ></textarea>
        </div>
      </form>
    </section>
  );
}
