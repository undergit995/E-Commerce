import React, { useState } from "react";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";

export default function FormValid() {

  const obj = {
    name: "",
    pasw: "",
  };
  const [sate, setSate] = useState(obj);
  const [err, setErr] = useState("");
    const navigate=useNavigate()

  function hChange(params) {
    setSate((p) => ({ ...p, [params.target.name]: params.target.value }));
  }

  async function name(params) {
    params.preventDefault();
    setErr("");
    try {
      const res = await fetch("db.json");
      if (!res.ok) {
        setErr("API Error");
        return
      }

      const data = await res.json();
      console.log(data.products[2].rating);
      const cookData=data.products.find((p) =>
        p.id == sate.name.trim() && Number(p.price) == sate.pasw.trim())
      // if(cookData.prime){}
    cookData? (Cookies.set("id1", cookData.name, { expires: 2 }),
            (navigate("/home")))
          : setErr("Invalid")
    } catch (Err) {
      setErr(Err.message);
    }
  }

  return (
    <div className="w-full h-screen mx-auto p-4 bg-blue-400 to-green-400">
      <div className="max-w-455">
      <form className="bg-white p-3 rounded flex flex-col  w-66 h-full mx-auto " onSubmit={name}>
        <label htmlFor="user" className="w-58">Username</label>
        <input
          type="text"
          id="user"
          name="name"
          onChange={hChange}
          className="border rounded w-58 "
        />
        <br />
        <label htmlFor="pasw" className="w-58">Password</label>
        <input
          type="password"
          id="pasw"
          name="pasw"
          onChange={hChange}
          className="border rounded w-58"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      <p>{err}</p>

      </div>
    </div>
  );
}
