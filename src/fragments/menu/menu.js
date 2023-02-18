import { useNavigate, Link } from "react-router-dom";
import { useState, useContext, useEffect} from "react"
import "./menu.css"
import { authContext } from "../../helpers/authContext"
import { notification } from 'antd';
import "antd/lib/notification/style/index.css";
import FlipNumbers from 'react-flip-numbers';
import points from "./points.png";

function Menu() {
  const navigate = useNavigate();
const [startMenu] = useState("animation start-" + window.location.pathname.slice(1, 30));
const { authState, setAuthState } = useContext(authContext);
  
const logout = () => {
  console.log(startMenu)
    localStorage.removeItem("token");
    setAuthState({ username: "",email: "", id: 0, pfp_src: "", status: false });
    navigate("/");
    notification["success"]({
      message: "Logged out successfully",
      description: "",
    });
  };

  return (
    <div>
      {authState.status?
      <>
      <nav className="navLogged">
		<Link to="/" className="nav-link" style={{ textDecoration: 'none' }}>Home</Link>
		<Link to="/play" className="nav-link" style={{ textDecoration: 'none' }}>Play</Link>
		<Link to="/leaderboard" className="nav-link" style={{ textDecoration: 'none' }}>Leaderboard</Link>
    <Link to="/shop" className="nav-link" style={{ textDecoration: 'none'}}>SHOP <span className="coins-text"><FlipNumbers height={14} width={10} play={true} duration={1} perspective={60} numbers={`${authState.coins}`} /><img style={{ width: "20px", marginLeft: "5px" }} src={points}></img></span></Link>
    <Link to="/myprofile" className="nav-link" style={{ textDecoration: 'none' }}><div><img style = {{width: '35px', verticalAlign: 'bottom', position: 'relative', marginBottom: '7.5px', marginRight: '6px'}} src={`data:image;base64,${authState.pfp_src}`}></img>{authState.username}</div></Link>
    <button onClick={logout} className="nav-link">LOGOUT</button>
    
    <div className={(startMenu === 'animation start-multiplayer' ? ('animation start-play'):(startMenu))}></div>		
        
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

		    
		<div className={(startMenu === 'animation start-multiplayer' ? ('animation start-play'):(startMenu))}></div>
        
        
	</nav>
      </>
      }
	
    </div>
  );
}

export default Menu;
