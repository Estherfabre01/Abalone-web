import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { logout } = useAuth();

  return (
    <div>
      <h2>Bienvenue, tu es connecté !</h2>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
