// import React, { useState } from "react";
// import Cookies from "js-cookie";
// import { Navigate, useNavigate } from "react-router-dom";

// export default function FormValid() {

//   const obj = {
//     name: "",
//     pasw: "",
//   };
//   const [sate, setSate] = useState(obj);
//   const [err, setErr] = useState("");
//     const navigate=useNavigate()

//   function hChange(params) {
//     setSate((p) => ({ ...p, [params.target.name]: params.target.value }));
//   }

//   async function name(params) {
//     params.preventDefault();
//     setErr("");
//     try {
//       const res = await fetch("db.json");
//       if (!res.ok) {
//         setErr("API Error");
//         return
//       }

//       const data = await res.json();
//       console.log(data.products[2].rating);
//       const cookData=data.products.find((p) =>
//         p.id == sate.name.trim() && Number(p.price) == sate.pasw.trim())
//       // if(cookData.prime){}
//     cookData? (Cookies.set("id1", cookData.name, { expires: 2 }),
//             (navigate("/home")))
//           : setErr("Invalid")
//     } catch (Err) {
//       setErr(Err.message);
//     }
//   }

//   return (
//     <div className="w-full h-screen mx-auto p-4 bg-blue-400 to-green-400">
//       <div className="max-w-455">
//       <form className="bg-white p-3 rounded flex flex-col  w-66 h-full mx-auto " onSubmit={name}>
//         <label htmlFor="user" className="w-58">Username</label>
//         <input
//           type="text"
//           id="user"
//           name="name"
//           onChange={hChange}
//           className="border rounded w-58 "
//         />
//         <br />
//         <label htmlFor="pasw" className="w-58">Password</label>
//         <input
//           type="password"
//           id="pasw"
//           name="pasw"
//           onChange={hChange}
//           className="border rounded w-58"
//         />
//         <br />
//         <button type="submit">Submit</button>
//       </form>
//       <p>{err}</p>

//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function FormValid() {
  const [state, setState] = useState({ name: "", pasw: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      const res = await fetch("db.json");
      if (!res.ok) return setErr("API Error");

      const data = await res.json();

      const user = data.products.find(
        (p) =>
          p.id == state.name.trim() &&
          Number(p.price) == state.pasw.trim()
      );

      if (user) {
        Cookies.set("id1", user.name, { expires: 2 });
        navigate("/home");
      } else {
        setErr("Invalid credentials");
      }
    } catch (error) {
      setErr(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-400">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80 flex flex-col gap-3"
      >
        <h2 className="text-lg font-semibold text-center">Login</h2>

        <input
          type="text"
          name="name"
          placeholder="Username"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="password"
          name="pasw"
          placeholder="Password"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Submit
        </button>

        {err && <p className="text-red-500 text-sm">{err}</p>}
      </form>
    </div>
  );
}