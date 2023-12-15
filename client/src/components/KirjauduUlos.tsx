import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const KirjauduUlos: React.FC<Props> = ({ setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/"); // Ohjaa käyttäjä kirjautumissivulle tai haluamallesi sivulle
  };

  return (
    <button onClick={handleLogout}>Kirjaudu ulos</button>
  );
};

export default KirjauduUlos;