import React, { useState } from "react";
import Axios from "axios";
import { useForm } from "react-hook-form";

function Myapp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [data, setData] = useState(null);

  const registerUser = () => {
    Axios({
      method: "POST",
      data: {
        username: registerUsername,
        password: registerPassword,
      },
      withCredentials: true,
      url: "http://localhost:8000/register",
    }).then((res) => console.log(res));
  };

  const login = () => {
    Axios.post(
      "http://localhost:8000/login",

      {
        username: loginUsername,
        password: loginPassword,
      },

      {
        withCredentials: true,
      }
    ).then((res) => console.log(res));
  };

  const getUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:8000/user",
    }).then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  };

  const inputValid = (fieldName) => {
    return {
      ...register(fieldName, {
        required: "this field is required",
        minLength: {
          value: 4,
          message: "must be more than 4 characters",
        },
      }),
    };
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit(registerUser)}>
        <h1>Register</h1>
        <input
          placeholder="username"
          {...inputValid("username")}
          onChange={(e) => setRegisterUsername(e.target.value)}
        />
        <p style={{ color: "red", fontSize: "12px" }}>
          {errors.username?.message}
        </p>
        <input
          placeholder="password"
          {...inputValid("password")}
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <p style={{ color: "red", fontSize: "12px" }}>
          {errors.password?.message}
        </p>

        <button type="submit">Submit</button>
      </form>

      <div>
        <h1>Login</h1>
        <input
          placeholder="username"
          onChange={(e) => setLoginUsername(e.target.value)}
        />
        <input
          placeholder="password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={login}>Submit</button>
      </div>

      <div>
        <h1>Get User</h1>
        <button onClick={getUser}>Submit</button>
        {data ? <h1>Welcome Back {data.username}</h1> : null}
      </div>
    </div>
  );
}

export default Myapp;
