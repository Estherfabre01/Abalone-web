import { useState } from "react";
import { login as apiLogin } from "../api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await apiLogin(email, password);

    if (res.token) {
      login(res.token, res.user);
      console.log("Réponse login :", res);
      navigate("/");
    }
  }

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" onChange={e => setPassword(e.target.value)} />
        <button>Se connecter</button>
      </form>
    </div>
  );
}
