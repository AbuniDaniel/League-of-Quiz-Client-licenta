import Menu from  "../../fragments/menu/menu"
import "./profile.css"
import Axios from "axios";
import {useState, useEffect, useContext} from "react";
import { authContext } from "../../helpers/authContext"

function Profile() {

    const { authState } = useContext(authContext);

    const [easy22correct, setEasy22correct] = useState(0)

    useEffect(() => {
        myProfile();
    }, [authState]);

    const myProfile = async() => {
        const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/myprofile", {
            id: authState.id,
    })
        setEasy22correct(response.data[0].easy22correct);
        console.log(response.data[0])
    }
    
      const test = () => {
        console.log(easy22correct);
      }

  return (
    <>
      <Menu />
      <div className="profile">
        <div> easy22correct: {easy22correct}</div>
        <button onClick={test}>click</button>
      
      
      </div> 
    </>
    
  );

}

export default Profile;