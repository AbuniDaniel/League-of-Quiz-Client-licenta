import Menu from "../../fragments/menu/menu";
import "./profile.css";
import Axios from "axios";
import { useState, useEffect, useContext } from "react";
import { authContext } from "../../helpers/authContext";
import {useFormik} from "formik";
import {schemaChangeUsername} from "../../schemas/schema"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { Modal, Button } from "antd";
import "./antdCss/modal_button.css";
import { notification } from "antd";
import "antd/lib/notification/style/index.css";
import { Switch, Table } from 'antd';
import "antd/lib/table/style/index.css";
import "antd/lib/pagination/style/index.css";
import "antd/lib/select/style/index.css";
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
let data_history = [];
let dataCreated3;

function Profile() {
  const { authState, setAuthState } = useContext(authContext);

  const [easy22correct, setEasy22correct] = useState(0);
  const [easy22wrong, setEasy22wrong] = useState(0);
  const [hard22correct, setHard22correct] = useState(0);
  const [hard22wrong, setHard22wrong] = useState(0);
  const [easy44correct, setEasy44correct] = useState(0);
  const [easy44wrong, setEasy44wrong] = useState(0);
  const [hard44correct, setHard44correct] = useState(0);
  const [hard44wrong, setHard44wrong] = useState(0);
  const [userEmail, setUserEmail] = useState();

  const [pfps, setPfps] = useState([]);

  const [pfpClicked, setPfpClicked] = useState("");

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [openUsername, setOpenUsername] = useState(false);
  const [confirmLoadingUsername, setConfirmLoadingUsername] = useState(false);

  const [loadingTable, setLoadingTable] = useState(true);

  const columns = [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      key: '1',
      width: 140,
      align: 'center',
    },
    {
      title: 'Correct/Wrong',
      dataIndex: 'correct_wrong',
      key: '2',
      width: 140,
      align: 'center',
    },
    {
      title: 'Your Answer',
      dataIndex: 'user_answer',
      key: '3',
      width: 140,
      height: 300,
      align: 'center',
    },
    {
      title: 'Correct Answer',
      dataIndex: 'correct_answer',
      key: '4',
      width: 140,
      align: 'center',
    },
    {
      title: 'ShopPoints',
      dataIndex: 'shop_points',
      key: '5',
      width: 140,
      align: 'center',
    },
    {
      title: 'Bonus Hints',
      dataIndex: 'bonus_hints',
      key: '6',
      width: 140,
      align: 'center',
    },
    {
      title: 'Date',
      dataIndex: 'history_date',
      key: '7',
      width: 140,
      align: 'center',
    },
    
  ];
  
  useEffect(() => {
    myProfile();
    fetchPfps();
    fetchUserHistory();
  }, [authState]);

  const myProfile = async () => {
    const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/myprofile", {
      id: authState.id,
    });
    let dataCreated = new Date(response.data[0].date)
    let dataCreated2 = new Date(dataCreated.setHours(dataCreated.getHours() + 2))
    dataCreated3 = dataCreated2.setSeconds(dataCreated2.getSeconds() - 104)
    setUserEmail(response.data[0].email)
    setEasy22correct(response.data[0].easy22correct);
    setEasy22wrong(response.data[0].easy22wrong);
    setHard22correct(response.data[0].hard22correct);
    setHard22wrong(response.data[0].hard22wrong);
    setEasy44correct(response.data[0].easy44correct);
    setEasy44wrong(response.data[0].easy44wrong);
    setHard44correct(response.data[0].hard44correct);
    setHard44wrong(response.data[0].hard44wrong);
  };

  const fetchPfps = async () => {
    const response = await Axios.get("https://daniel-licenta-api.herokuapp.com/pfp-options");
    setPfps(response.data);
  };

  //legat de x minutes ago
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();
  
    if (minutes < 10) {
      // Adding leading zero to minutes
      minutes = `0${ minutes }`;
    }
  
    if (prefomattedDate) {
      // Today at 10:20
      // Yesterday at 10:20
      return `${ prefomattedDate } at ${ hours }:${ minutes }`;
    }
  
    if (hideYear) {
      // 10. January at 10:20
      return `${ day }.${ month } at ${ hours }:${ minutes }`;
    }
  
    // 10. January 2017. at 10:20
    return `${ day }.${ month }.${ year } at ${ hours }:${ minutes }`;
  }
  
  
  // --- Main function
  function timeAgo(dateParam) {
    if (!dateParam) {
      return null;
    }
  
    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();
  
  
    if (seconds < 60) {
      return `${ seconds } seconds ago`;
    } else if (seconds < 90) {
      return 'about a minute ago';
    } else if (minutes < 60) {
      return `${ minutes } minutes ago`;
    } else if (isToday) {
      return getFormattedDate(date, 'Today'); // Today at 10:20
    } else if (isYesterday) {
      return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
    } else if (isThisYear) {
      return getFormattedDate(date, false, true); // 10. January at 10:20
    }
  
    return getFormattedDate(date); // 10. January 2017. at 10:20
  }

  // x minutes ago pentru cont creat

  // --- Main function
  function timeAgoCreated(dateParam) {
    if (!dateParam) {
      return null;
    }
  
    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();
  
    return getFormattedDate(date); // 10. January 2017. at 10:20
  }
  //gata legat de x minutes ago

  const fetchUserHistory = async () => {
    const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/user-history" ,{
      id: authState.id,
    });
    if(authState.status)
    {
      data_history = [];
      for (let i = 0; i < response.data.length; i++) {
        let jsDate = new Date(response.data[i].date);
        let checkCorrectWrong;
        let checkGameType;
        let checkShopPoints = 0;
        let showCorrect = response.data[i].correct_answer.charAt(0).toUpperCase() + response.data[i].correct_answer.slice(1).toLowerCase()
        if(response.data[i].user_answer === response.data[i].correct_answer)
          checkCorrectWrong = "Correct"
        else{
          checkCorrectWrong = "Wrong"

          for (let j = 0; j < response.data.length; j++) {
            if(response.data[i].correct_answer === response.data[j].user_answer && response.data[i].game_type === response.data[j].game_type && response.data[j].user_answer === response.data[j].correct_answer){
              showCorrect = response.data[i].correct_answer.charAt(0).toUpperCase() + response.data[i].correct_answer.slice(1).toLowerCase()
              break;
            }
            else{
              showCorrect = "-";
            }
          }

        }
          

        if(response.data[i].game_type === "easy22"){
          checkGameType = "Easy 2x2"
          if(checkCorrectWrong === "Correct")
            checkShopPoints = 1
        }
        else if(response.data[i].game_type === "hard22"){
          checkGameType = "Hard 2x2"
          if(checkCorrectWrong === "Correct")
            checkShopPoints = 2
        }
        else if(response.data[i].game_type === "easy44"){
          checkGameType = "Easy 4x4"
          if(checkCorrectWrong === "Correct")
            checkShopPoints = 3
        }
        else if(response.data[i].game_type === "hard44"){
          checkGameType = "Hard 4x4"
          if(checkCorrectWrong === "Correct")
            checkShopPoints = 5
        }
        let jsDate2 = new Date(jsDate.setHours(jsDate.getHours() + 2))
        data_history.push({
          key: i,
          game_type: checkGameType,
          user_answer: response.data[i].user_answer.charAt(0).toUpperCase() + response.data[i].user_answer.slice(1).toLowerCase(),
          correct_answer: showCorrect,
          correct_wrong: checkCorrectWrong,
          shop_points: checkShopPoints,
          bonus_hints: response.data[i].bonus,
          history_date: timeAgo(jsDate2.setSeconds(jsDate2.getSeconds() - 104)),
        });
      }
    }
    setLoadingTable(false);
  };

  const data1 = {
    labels: ["corecte", "gresite"],
    datasets: [
      {
        data: [easy22correct, easy22wrong],
        backgroundColor: ["rgba(54, 162, 235, 0.4)", "rgba(255, 99, 132, 0.4)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const data2 = {
    labels: ["corecte", "gresite"],
    datasets: [
      {
        data: [hard22correct, hard22wrong],
        backgroundColor: ["rgba(54, 162, 235, 0.4)", "rgba(255, 99, 132, 0.4)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const data3 = {
    labels: ["corecte", "gresite"],
    datasets: [
      {
        data: [easy44correct, easy44wrong],
        backgroundColor: ["rgba(54, 162, 235, 0.4)", "rgba(255, 99, 132, 0.4)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const data4 = {
    labels: ["corecte", "gresite"],
    datasets: [
      {
        data: [hard44correct, hard44wrong],
        backgroundColor: ["rgba(54, 162, 235, 0.4)", "rgba(255, 99, 132, 0.4)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const pfpClick = (name) => {
    setPfpClicked(name);
  };

  // modal avatar
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = async () => {
    setConfirmLoading(true);

    const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/change-pfp", {
      id: authState.id,
      pfp_name: pfpClicked,
    });
    if (response.data.type === "success") {
      notification[response.data.type]({
        message: response.data.message,
        description: response.data.description,
      });
      setAuthState({ ...authState, pfp_src: response.data.pfp_src})
      setOpen(false);
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // modal username
  const showUsernameModal = () => {
    setOpenUsername(true);
  };


  const handleCancelUsername = () => {
    setOpenUsername(false);
  };

  const changeUsername = async (values, actions) => {
    setConfirmLoadingUsername(true);
    const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/change-username", {
        token: localStorage.getItem("token"),
        id: authState.id,
        username: values.username,
        
    });
    notification[response.data.type]({
      message: response.data.message,
      description: response.data.description,
    });
    if (response.data.type === "success") {
      setAuthState({ ...authState, username: values.username})
      setOpenUsername(false);
    }
    actions.resetForm();
    setConfirmLoadingUsername(false);
  };

  const {values, errors, touched, handleBlur, handleChange, handleSubmit} = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema: schemaChangeUsername,
    onSubmit: changeUsername,
  });
  
  return (
    <>
      <Menu />
      <div className="profile">
        <div className="chenar-profil-stats">
        <div className="chenar-profil">
          <div className="chenar-wrapper">
            <img
              className="img-profil"
              style={{ width: "200px", height: "200px" }}
              src={`data:image;base64,${authState.pfp_src}`}
            ></img>
            <h2>Username: {authState.username}</h2>
            <button className="changepfp" onClick={showUsernameModal}>Change Username</button>
            <button className="changepfp">Change Password</button>
            <button className="changepfp">Change Email</button>
            <button onClick={showModal} className="changepfp">
              Change Avatar
            </button>
            
            <p className="date-created">Email: {userEmail}</p>
            <p className="date-created">Account created on: {timeAgoCreated(dataCreated3)}</p>
            
            <Modal
              title="Change Avatar"
              bodyStyle={{ backgroundColor: "#d0d5df" }}
              open={open}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
              width={1188}
            >
              {pfps.map((val, key) => {
                return (
                  <img
                    className="changePfpImg"
                    onClick={() => pfpClick(val.pfp_name)}
                    src={`data:image;base64,${val.src}`}
                  ></img>
                );
              })}
            </Modal>

            <Modal
              title="Change Username"
              bodyStyle={{ backgroundColor: "#d0d5df" }}
              open={openUsername}
              onOk={handleSubmit}
              confirmLoading={confirmLoadingUsername}
              onCancel={handleCancelUsername}
            >
              <input type="text" placeholder="Username"
              id="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{width:"270px"}}
              className={errors.username && touched.username ? "input-error" : "username"}
              />
              {errors.username && touched.username && <p className="error-message-change-username">{errors.username}</p>}
              
            </Modal>
          </div>
        </div>
        <div className="chenar-stats">
          <div className="flex-row">
            <div className="pie-charts">
              <Pie
                data={data1}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text:
                        "Easy 2x2 correct answer rate: " +
                        (
                          (easy22correct / (easy22correct + easy22wrong)) *
                          100
                        ).toFixed(2) +
                        "%",
                      position: "top",
                      align: "center",
                      color: "#00a8ff",
                      font: {
                        size: 15,
                      },
                    },
                    legend: {
                      labels: {
                        color: "#ecf0f1",
                      },
                    },
                  },
                }}
              />
            </div>

            <div className="pie-charts">
              <Pie
                data={data2}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text:
                        "Hard 2x2 correct answer rate: " +
                        (
                          (hard22correct / (hard22correct + hard22wrong)) *
                          100
                        ).toFixed(2) +
                        "%",
                      position: "top",
                      align: "center",
                      color: "#00a8ff",
                      font: {
                        size: 15,
                      },
                    },
                    legend: {
                      labels: {
                        color: "#ecf0f1",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="flex-row">
            <div className="pie-charts">
              <Pie
                data={data3}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text:
                        "Easy 4x4 correct answer rate: " +
                        (
                          (easy44correct / (easy44correct + easy44wrong)) *
                          100
                        ).toFixed(2) +
                        "%",
                      position: "top",
                      align: "center",
                      color: "#00a8ff",
                      font: {
                        size: 15,
                      },
                    },
                    legend: {
                      labels: {
                        color: "#ecf0f1",
                      },
                    },
                  },
                }}
              />
            </div>

            <div className="pie-charts">
              <Pie
                data={data4}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text:
                        "Hard 4x4 correct answer rate: " +
                        (
                          (hard44correct / (hard44correct + hard44wrong)) *
                          100
                        ).toFixed(2) +
                        "%",
                      position: "top",
                      align: "center",
                      color: "#00a8ff",
                      font: {
                        size: 15,
                      },
                    },
                    legend: {
                      labels: {
                        color: "#ecf0f1",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        </div>
        <div className="chenar-history">
          <Table
            columns={columns}
            dataSource={loadingTable ? [] : data_history}
            rowClassName={(record, index) => record.correct_wrong==="Wrong" ? 'table-row-wrong' :  'table-row-correct'}
            bordered={true}
          />
        </div>
      </div>
    </>
  );
}

export default Profile;
