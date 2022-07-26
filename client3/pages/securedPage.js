import React, { useEffect } from "react";
import Link from "next/link";
import { useGlobalContext } from "../context";
import Axios from "axios";
let count = 1;
function SecuredPage() {
  useEffect(() => {
    count++;
    console.log(count);
  });
  const { data } = useGlobalContext();

  const logOut = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:8000/logout",
    }).then((res) => {
      console.log(res);
    });
  };

  if (!data) {
    return (
      <div>
        <h3>
          you are not authorized please
          <Link href="/">
            <span
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Login
            </span>
          </Link>
        </h3>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>This is a secured page</h1>
      </div>

      <div>
        <h2>Welcome {data.username} you are authorized</h2>
        <button onClick={logOut}>Logout</button>
      </div>
    </div>
  );
}

export default SecuredPage;

// export async function getServerSideProps(req, res) {
//   const data = await getData('"http://localhost:8000/user');
//   return {
//     props: { data },
//   };
// }
