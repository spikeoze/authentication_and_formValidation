import React, { useState, useContext, createContext, useEffect } from "react";
import Axios from "axios";
const appContext = createContext();
import useSWR from "swr";

const fetcher = (url) =>
  Axios.get(url, { withCredentials: true }).then((res) => res.data);

function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const { data, error } = useSWR("http://localhost:8000/user", fetcher, {refreshInterval:100});
  console.log(data);

  // useEffect(() => {
  //   Axios({
  //     method: "GET",
  //     withCredentials: true,
  //     url: "http://localhost:8000/user",
  //   }).then((res) => {
  //     setUser(res.data?.username);
  //     console.log(res.data);
  //   });
  // }, []);

  return <appContext.Provider value={{ data }}>{children}</appContext.Provider>;
}

const useGlobalContext = () => {
  return useContext(appContext);
};

export { AppContextProvider, useGlobalContext };
