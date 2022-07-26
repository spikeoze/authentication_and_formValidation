import Head from "next/head";
import Image from "next/image";
import Link from "next/dist/client/link";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import Axios from "axios";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
export default function Home() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setError,
    clearErrors,
    formState: { errors: errors2 },
  } = useForm();
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [darkTheme, setDarkTheme] = useState(false);
  const [data, setData] = useState(null);

  console.log(errors2);
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
    )
      .then((res) => {
        console.log(res);
        router.push("/securedPage")
      })
      .catch((err) => {
        console.log(err.response.data);
        setError("invalid", {
          type: "custom",
          message: err.response.data,
        });
      });
  };

  const registerValid = (fieldName) => {
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

  const loginValid = (fieldName) => {
    return {
      ...register2(fieldName, {
        required: "this field is required",
        minLength: {
          value: 4,
          message: "must be more than 4 characters",
        },
      }),
    };
  };

  return (
    <div className={darkTheme ? "dark" : ""}>
      <div className="bg-gray-100 min-h-screen dark:bg-gray-700  ">
        <div className="flex flex-col justify-center items-center">
          <button
            type="button"
            onClick={() => setDarkTheme(!darkTheme)}
            className="text-center text-sm sm:text-md dark:bg-gray-50 m-5 dark:text-gray-900 bg-white rounded-sm border px-2 py-1 hover:shadow-lg"
          >
            {darkTheme ? "💡 Light" : "🌙 Dark"}
          </button>
          <div className="bg-slate-300 dark:bg-slate-600 w-fit p-3 rounded-sm shadow-md m-3">
            <form
              onSubmit={handleSubmit(registerUser)}
              className="flex flex-col justify-center items-center"
            >
              <p className="text-sm dark:text-slate-200 mb-3 underline-offset-4 underline p-1">
                Register
              </p>
              <input
                placeholder="username"
                {...registerValid("username")}
                className="p-1 m-1 focus:outline-none text-sm shadow-sm bg-inherit dark:text-slate-200 border-b-black dark:border-slate-200 border border-t-0 border-r-0 border-l-0 w-full my-1 "
                autoComplete="off"
                onChange={(e) => setRegisterUsername(e.target.value)}
              />
              <p className="items-start text-red-500 text-xs ">
                {errors.username?.message}
              </p>
              <input
                placeholder="password"
                className="p-1 m-1 focus:outline-none text-sm shadow-sm bg-inherit dark:text-slate-200 border-b-black dark:border-slate-200 border border-t-0 border-r-0 border-l-0 w-full my-1 "
                autoComplete="off"
                {...registerValid("password")}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors.password?.message}
              </p>

              <button
                type="submit"
                className="bg-slate-500 text-slate-200 dark:text-slate-900 font-semibold dark:bg-slate-200 dark:hover:bg-slate-100 hover:bg-slate-600 w-full p-1 m-1 mt-4 rounded-md text-sm"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="bg-slate-300 dark:bg-slate-600 w-fit p-3 rounded-sm shadow-md m-3">
            <form
              onSubmit={handleSubmit2(login)}
              className="flex flex-col justify-center items-center "
            >
              <p className="text-sm dark:text-slate-200 mb-3 underline-offset-4 underline p-1">
                Login
              </p>
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors2.invalid?.message}
              </p>
              <input
                placeholder="username"
                {...loginValid("loginUsername")}
                className="p-1 m-1 focus:outline-none text-sm shadow-sm bg-inherit dark:text-slate-200 border-b-black dark:border-slate-200 border border-t-0 border-r-0 border-l-0 w-full my-1 "
                autoComplete="off"
                onChange={(e) => {
                  setLoginUsername(e.target.value);
                  clearErrors("invalid");
                }}
              />
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors2.loginUsername?.message}
              </p>
              <input
                placeholder="password"
                className="p-1 m-1 focus:outline-none text-sm shadow-sm bg-inherit dark:text-slate-200 border-b-black dark:border-slate-200 border border-t-0 border-r-0 border-l-0 w-full my-1 "
                autoComplete="off"
                {...loginValid("loginPassword")}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <p style={{ color: "red", fontSize: "12px" }}>
                {errors2.loginPassword?.message}
              </p>
              <button
                type="submit"
                className="bg-slate-500 text-slate-200 dark:text-slate-900 font-semibold dark:bg-slate-200 dark:hover:bg-slate-100 hover:bg-slate-600 w-full p-1 m-1 mt-4 rounded-md text-sm"
              >
                login
              </button>
            </form>
          </div>

          <div>
            <p className="bg-slate-500 text-center text-slate-200 dark:text-slate-900 font-semibold dark:bg-slate-200 dark:hover:bg-slate-100 hover:bg-slate-600 w-full p-1 m-1 mt-4 rounded-md text-sm">
              <Link href="/securedPage">Go to secured page</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
