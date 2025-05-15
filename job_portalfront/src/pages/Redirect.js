import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../jop_portalfrontend/src/axios";

function Redirect() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/me");
        const { role, profile_completed } = res.data;

        if (role === "candidat") {
          if (!profile_completed) {
            navigate("/complete-profile");
          } else {
            navigate("/candidathome");
          }
        } else if (role === "employeur") {
          navigate("/employeur");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Erreur d'authentification :", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  return <p>{loading ? "Redirection en cours..." : ""}</p>;
}

export default Redirect;