import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

function Redirect() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/me");
        const role = res.data.role;

        if (role === "candidat") {
          navigate("/candidat");
        } else if (role === "employeur") {
          navigate("/employeur");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Erreur d'authentification", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  return <p>{loading ? "Redirection en cours..." : ""}</p>;
}

export default Redirect;
