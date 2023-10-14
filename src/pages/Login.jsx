import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//IMPORTING COMPONENTS.
import PageNav from "../components/PageNav";
import Button from "../components/Button";

//IMPORTING CONTEXT.
import { useAuth } from "../contexts/AuthenticationContext";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Fetch functions defined in the context.
  const { login, isAuthenticated } = useAuth();

  //Fetching navigate function.
  const navigate = useNavigate();

  //React hook to synchronise authentication from the remote server.
  useEffect(
    function () {
      if (isAuthenticated) {
        navigate("/app", { replace: true });
      }
    },
    [isAuthenticated, navigate]
  );

  function handleSubmit(e) {
    e.preventDefault();

    if (email && password) {
      login(email, password);
    }
  }

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            // value={"test@test.com"}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            // value={"test"}
          />
        </div>

        <div>
          {/* <button>Login</button> */}
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
