import { Link } from "react-router-dom";
import { useState, useContext,} from "react"
import "./menu.css"
import { authContext } from "../../helpers/authContext"

function Menu() {

const [startMenu] = useState("animation start-" + window.location.pathname.slice(1, 30));
const { authState, setAuthState } = useContext(authContext);

  
const logout = () => {
    localStorage.removeItem("token");
    setAuthState({ username: "",email: "", id: 0, status: false });
  };


  return (
    <div>
      {authState.status?
      <>
      <nav className="navLogged">
		<Link to="/" className="nav-link" style={{ textDecoration: 'none' }}>Home</Link>
		<Link to="/play" className="nav-link" style={{ textDecoration: 'none' }}>Play</Link>
		<Link to="/leaderboard" className="nav-link" style={{ textDecoration: 'none' }}>Leaderboard</Link>
    <Link to="/shop" className="nav-link" style={{ textDecoration: 'none' }}>SHOP </Link>
    <Link to="/myprofile" className="nav-link" style={{ textDecoration: 'none' }}>{authState.username}</Link>
    <button onClick={logout} className="nav-link">LOGOUT</button>
 
		<div className={startMenu}></div>
        
	  </nav>
      </>
      :
      <>
      <nav className="nav">
		<Link to="/" className="nav-link" style={{ textDecoration: 'none' }}>Home</Link>
		<Link to="/play" className="nav-link" style={{ textDecoration: 'none' }}>Play</Link>
		<Link to="/leaderboard" className="nav-link" style={{ textDecoration: 'none' }}>Leaderboard</Link>
    <Link to="/login" className="nav-link" style={{ textDecoration: 'none' }}>Login</Link>
		<Link to="/register" className="nav-link" style={{ textDecoration: 'none' }}>Register</Link>

		    
		<div className={startMenu}></div>
        
        
	</nav>
      </>
      }
	
    </div>
  );
}

export default Menu;
