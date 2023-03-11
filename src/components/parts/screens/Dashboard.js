import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, getAuth } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";

import { getDatabase, ref, child, get, set } from "firebase/database";

function Dashboard() {
  const navigate = useNavigate();
  const [userId, setuserID] = useState("");
  const [email, setemail] = useState("");
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setuserID(uid);
        console.log("uid", uid);

        const dbRef = ref(getDatabase());
        get(child(dbRef, "users/" + uid))
          .then((snapshot) => {
            if (snapshot.exists()) {
              let tempobj = {};

              snapshot.forEach((child) => {
                if (child.key !== "email") {
                  tempobj[child.key] = child.val();
                } else {
                  setemail(child.val());
                }
              });

              setcities(tempobj);
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.log("user is logged out");
        navigate("/login");
      }
    });
  }, []);

  const [cities, setcities] = useState({});
  const [citySearch, setcitySearch] = useState("");
  const [temps, setTemps] = useState([]);
  const [times, setTimes] = useState([]);
  const [selected, setselected] = useState("");

  const addCity = () => {
    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + citySearch)
      .then((res) => res.json())
      .then(
        (result) => {
          let tempC = citySearch;
          if (result.results || result.results !== undefined) {
            const db = getDatabase();
            set(ref(db, "users/" + userId + "/" + tempC), {
              latitude: result.results[0].latitude,
              longitude: result.results[0].longitude,
            });

            setcities({
              ...cities,
              [tempC]: {
                latitude: result.results[0].latitude,
                longitude: result.results[0].longitude,
              },
            });

            fetch(
              "https://api.open-meteo.com/v1/forecast?latitude=" +
                result.results[0].latitude +
                "&longitude=" +
                result.results[0].longitude +
                "&current_weather=true&hourly=temperature_2m"
            )
              .then((res) => res.json())
              .then(
                (result) => {
                  setTemps(result.hourly.temperature_2m);
                  setselected(citySearch);
                  setTimes(result.hourly.time);
                },
                (error) => {}
              );
          } else {
            alert("city not found");
          }
        },
        (error) => {}
      );
  };

  const getData = (city) => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=" +
        cities[city].latitude +
        "&longitude=" +
        cities[city].longitude +
        "&current_weather=true&hourly=temperature_2m"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setTemps(result.hourly.temperature_2m);
          setselected(city);
          setTimes(result.hourly.time);
        },
        (error) => {}
      );
  };

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };
  let buttons = [];
  for (let city in cities) {
    buttons.push(
      <button
        style={{
          marginRight: "2vw",
          paddingLeft: "3vw",
          paddingRight: "3vw",
          fontSize: "5vw",
          marginTop: "2vw",
          borderRadius: "5px",
          backgroundColor: selected === city ? "lightblue" : "",
        }}
        onClick={() => {
          getData(city);
        }}
      >
        <b>{city}</b>
      </button>
    );
  }

  let info = [];
  const d = new Date();
  let hour = d.getHours();
  info.push(
    <div
      style={{
        display: "flex",
        width: "50vw",
        backgroundColor: "whtie",
        marginTop: "5vw",
        marginBottom: "2vw",
      }}
    >
      <div style={{ flex: "1", textAlign: "left", fontSize: "5vw" }}>
        <b>Time</b>{" "}
      </div>
      <div style={{ flex: "1", textAlign: "left", fontSize: "5vw" }}>
        <b>Temperature</b>
      </div>
    </div>
  );
  for (let i = hour; i < hour + 10; i++) {
    if (temps[i] !== undefined) {
      let tempTime = new Date(times[i].toString());
      let temphour = tempTime.getHours();
      info.push(
        <div
          style={{
            display: "flex",
            width: "50vw",
            backgroundColor: "white",
            paddingTop: "2vw",
          }}
        >
          <div style={{ fontSize: "5vw", flex: "1", textAlign: "left" }}>
            {temphour}
            {":00 "}
          </div>
          <div style={{ fontSize: "5vw", flex: "1", textAlign: "left" }}>
            {parseFloat((temps[i] * 1.8 + 32).toPrecision(3)) + "°F"}
          </div>
        </div>
      );
    }
  }
  return (
    <div style={{ textAlign: "center", padding: "5vh" }}>
      <h1> Welcome {email}</h1>
      <div style={{ textAlign: "left" }}>{buttons}</div>
      <div style={{ paddingTop: "2vh", display: "flex" }}>
        <input
          type="text"
          style={{
            marginRight: "2vw",
            fontSize: "5vw",
            width: "50vw",
          }}
          value={citySearch}
          onChange={(e) => setcitySearch(e.target.value)}
        />
        <button
          style={{
            marginRight: "2vw",
            fontSize: "5vw",
            width: "8vw",
            height: "8vw",
            borderRadius: "8px",
          }}
          onClick={addCity}
        >
          <b>+</b>
        </button>
        <button
          style={{
            marginRight: "2vw",
            fontSize: "5vw",
            width: "20vw",
            height: "8vw",
            borderRadius: "8px",
            backgroundColor: "#FF9999",
          }}
          onClick={logout}
        >
          <b>Logout</b>
        </button>
      </div>
      {info}
    </div>
  );
}

export default Dashboard;
