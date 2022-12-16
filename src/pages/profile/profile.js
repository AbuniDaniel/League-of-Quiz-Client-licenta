import Menu from "../../fragments/menu/menu";
import "./profile.css";
import unranked from "./ranks/unranked.webp"
import bronze from "./ranks/bronze.webp"
import silver from "./ranks/silver.webp"
import gold from "./ranks/gold.webp"
import platinum from "./ranks/platinum.webp"
import diamond from "./ranks/diamond.webp"
import master from "./ranks/master.webp"
import challenger from "./ranks/challenger.webp"
import question_mark from "../play/hint-button.png"
import Axios from "axios";
import { useState, useEffect, useContext } from "react";
import { authContext } from "../../helpers/authContext";
import {useFormik} from "formik";
import {schemaChangeUsername, schemaChangePassword} from "../../schemas/schema"
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
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import "antd/lib/spin/style/index.css";
import { Progress } from 'antd';
import "antd/lib/progress/style/index.css";
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

  const [pageLoading, setPageLoading] = useState(true);

  const [easy22correct, setEasy22correct] = useState(0);
  const [easy22wrong, setEasy22wrong] = useState(0);
  const [hard22correct, setHard22correct] = useState(0);
  const [hard22wrong, setHard22wrong] = useState(0);
  const [easy44correct, setEasy44correct] = useState(0);
  const [easy44wrong, setEasy44wrong] = useState(0);
  const [hard44correct, setHard44correct] = useState(0);
  const [hard44wrong, setHard44wrong] = useState(0);
  const [userEmail, setUserEmail] = useState();
  const [rank, setRank] = useState("");
  const [rankPoints, setRankPoints] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [pfps, setPfps] = useState([]);

  const [pfpClicked, setPfpClicked] = useState("");

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [openUsername, setOpenUsername] = useState(false);
  const [confirmLoadingUsername, setConfirmLoadingUsername] = useState(false);

  const [openPassword, setOpenPassword] = useState(false);
  const [confirmLoadingPassword, setConfirmLoadingPassword] = useState(false);

  const [loadingTable, setLoadingTable] = useState(true);

  const[statisticsLocked, setStatisticsLocked] = useState(false);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 30,
      }}
      spin
    />
  );

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

  let profile, pfp, userHistory
  const myProfile = async () => {
    const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/myprofile", {
      id: authState.id,
    });
    profile = response;
    let dataCreated = new Date(response.data[0].date)
    let dataCreated2 = new Date(dataCreated.setHours(dataCreated.getHours() + 2))
    dataCreated3 = dataCreated2.setSeconds(dataCreated2.getSeconds() - 3)
    setUserEmail(response.data[0].email)
    setEasy22correct(response.data[0].easy22correct);
    setEasy22wrong(response.data[0].easy22wrong);
    setHard22correct(response.data[0].hard22correct);
    setHard22wrong(response.data[0].hard22wrong);
    setEasy44correct(response.data[0].easy44correct);
    setEasy44wrong(response.data[0].easy44wrong);
    setHard44correct(response.data[0].hard44correct);
    setHard44wrong(response.data[0].hard44wrong);
    
    if((response.data[0].easy22correct == 0 && response.data[0].easy22wrong == 0) || (response.data[0].hard22correct == 0 && response.data[0].hard22wrong == 0) || (response.data[0].easy44correct == 0 && response.data[0].easy44wrong == 0) || (response.data[0].hard44correct == 0 && response.data[0].hard44wrong == 0))
      setStatisticsLocked(true)

    let rankpoints = response.data[0].rank_points;
    setRankPoints(rankpoints);
    if(rankpoints == 0)
      setRank(unranked)
    if(rankpoints > 0 && rankpoints < 53){
      setPercentage(((rankpoints/53)*100).toFixed(2))
      setRank(bronze)
    }
      
    else if(rankpoints >= 53 && rankpoints < 141){
      setPercentage((100 * (rankpoints - 53)/(141 - 53)).toFixed(2))
      setRank(silver)
    }
      
    else if(rankpoints >= 141 && rankpoints < 317){
      setPercentage((100 * (rankpoints - 141)/(317 - 141)).toFixed(2))
      setRank(gold)
    }
      
    else if(rankpoints >= 317 && rankpoints < 601){
      setPercentage((100 * (rankpoints - 317)/(601 - 317)).toFixed(2))
      setRank(platinum)
    }
      
    else if(rankpoints >= 601 && rankpoints < 1061){
      setPercentage((100 * (rankpoints - 601)/(1061 - 601)).toFixed(2))
      setRank(diamond)
    }
      
    else if(rankpoints >= 1061 && rankpoints < 1771){
      setPercentage((100 * (rankpoints - 1061)/(1771 - 1061)).toFixed(2))
      console.log((100 * (rankpoints - 1061)/(1771 - 1061)))
      setRank(master)
    }
      
    else if(rankpoints == 1771){
      setPercentage(100)
      setRank(challenger)
    }
      
  };

  const fetchPfps = async () => {
    const response = await Axios.get("https://daniel-licenta-api.herokuapp.com/pfp-options");
    pfp = response;
    setPageLoading(false)
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
    userHistory = response;
    console.log(response);
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
          history_date: timeAgo(jsDate2.setSeconds(jsDate2.getSeconds() - 3)),
        });
      }
    }
    setLoadingTable(false);
  };

  const data1 = {
    labels: ["Correct", "Wrong"],
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
    labels: ["Correct", "Wrong"],
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
    labels: ["Correct", "Wrong"],
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
    labels: ["Correct", "Wrong"],
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
      pfp_name: pfpClicked,
    },
    {
      headers: {
    "x-access-token": localStorage.getItem("token"),
      }
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
    values.username = ""
    errors.username = ""
    touched.username = false
  };

  const changeUsername = async (values, actions) => {
    setConfirmLoadingUsername(true);
    const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/change-username", {
        username: values.username,
    },
    {
      headers: {
    "x-access-token": localStorage.getItem("token"),
      }
    }
    );

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
  
    // modal password
    const showPasswordModal = () => {
      setOpenPassword(true);
    };
  
  
    const handleCancelPassword = () => {
      setOpenPassword(false);
      formik.values.currentPassword = ""
      formik.values.newPassword = ""
      formik.values.confirmNewPassword = ""

      formik.errors.currentPassword = ""
      formik.errors.newPassword = ""
      formik.errors.confirmNewPassword = ""

      formik.touched.currentPassword = false
      formik.touched.newPassword = false
      formik.touched.confirmNewPassword = false
    };
  
    const changePassword = async (values, actions) => {
      setConfirmLoadingPassword(true);
      const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/change-password", {
          newPassword: values.newPassword,
          currentPassword: values.currentPassword
      },
      {
        headers: {
      "x-access-token": localStorage.getItem("token"),
        }
      }
      );

      if (response.data.type === "error") {
        notification[response.data.type]({
        message: response.data.message,
        description: response.data.description,
      });
      }
      else{
        notification[response.data.type]({
          message: response.data.message,
          description: response.data.description,
        });
        setOpenPassword(false);
        actions.resetForm();
      
      }
      setConfirmLoadingPassword(false);
    };

    const formik = useFormik({
      initialValues: {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      validationSchema: schemaChangePassword,
      onSubmit: changePassword,
    });

  //modal RP info

  const [openRP, setOpenRP] = useState(false);

  const showModalRP = () =>{
    setOpenRP(true);
  }

  const handleCancelRP = () =>{
    setOpenRP(false);
  }
  return (
    <>
      <Menu />
      
      <div className="profile">
        <div className="chenar-profil-stats">
          <div className="chenar-profil">
          {pageLoading? (
              <div className="loading-locked-statistics">
                <Spin indicator={antIcon} />
              </div>
            ) : (<div className="chenar-wrapper">
            <div style={{display: 'flex', flexDirection: 'column',alignItems: "center"}}>
          <div
              style={{
                width: "300px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                margin: "-20px 0 -4px 0",
              }}
            >
              <Modal
              bodyStyle={{ backgroundColor: "#303952" }}
      open={openRP}
      title="Rank Points Info"
      onCancel={handleCancelRP}
      footer={null}
    >
      <div className="container-modal-rp">
      RP means "Rank Points" and can be obtained from the correct answers according to the table below:
      <table>
  <thead>
  <tr>
      <th>Game Mode</th>
      <th>RP</th>
  </tr>
  </thead>
  <tr>
      <td>Easy 2x2</td>
      <td>1</td>
  </tr>
  <tr>
      <td>Hard 2x2</td>
      <td>2</td>
  </tr>
  <tr>
      <td>Easy 4x4</td>
      <td>3</td>
  </tr>
  <tr>
      <td>Hard 4x4</td>
      <td>5</td>
  </tr>

</table>
<p>The distribution of ranks is done in the following way:</p>
<div className="container-modal-rp-flex"><img style={{width: 100}} src={unranked}></img><p>0 RP</p></div>
<div className="container-modal-rp-flex"><img style={{width: 100}} src={bronze}></img><p>between 1 RP and 52 RP</p></div>
<div className="container-modal-rp-flex"><img style={{width: 100}} src={silver}></img><p>between 53 RP and 140 RP</p></div>
<div className="container-modal-rp-flex"><img style={{width: 100}} src={gold}></img><p>between 141 RP and 316 RP</p></div>
<div className="container-modal-rp-flex"><img style={{width: 100}} src={platinum}></img><p>between 317 RP and 600 RP</p></div>
<div className="container-modal-rp-flex"><img style={{width: 100}} src={diamond}></img><p>between 601 RP and 1060 RP</p></div>
<div className="container-modal-rp-flex"><img style={{width: 100}} src={master}></img><p>between 1061 RP and 1770 RP</p></div>
<div className="container-modal-rp-flex"><img style={{width: 100}} src={challenger}></img><p>1771 RP</p></div>
</div>
    </Modal>
              <img onClick={showModalRP} style = {{width: 50, cursor: 'pointer'}} src={question_mark}></img>
              <img style={{ width: "120px" }} src={rank}></img>
              <p className="text-rp" style={{ margin: "0" }}>{`${rankPoints} RP`}</p>
            </div>
            <div style={{width: 220}}><Progress percent={`${percentage}`} size="small" status="active" /></div>
            </div>
            
            <img
              className="img-profil"
              style={{ width: "200px", height: "200px" }}
              src={`data:image;base64,${authState.pfp_src}`}
            ></img>
            <h2>Username: {authState.username}</h2>
            <button onClick={showModal} className="changepfp">
              Change Avatar & Background
            </button>
            <button className="changepfp" onClick={showUsernameModal}>
              Change Username
            </button>
            <button className="changepfp" onClick={showPasswordModal}>
              Change Password
            </button>
            <button className="changepfp">Change Email</button>

            <p className="date-created">Email: {userEmail}</p>
            <p className="date-created">
              Account created on: {timeAgoCreated(dataCreated3)}
            </p>

            <Modal
              title="Change Avatar & Background from Leaderboard"
              bodyStyle={{ backgroundColor: "#303952" }}
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
              title="Change Password"
              bodyStyle={{ backgroundColor: "#303952" }}
              open={openPassword}
              onOk={formik.handleSubmit}
              confirmLoading={confirmLoadingPassword}
              onCancel={handleCancelPassword}
            >
              <input
                type="password"
                placeholder="Current password"
                id="currentPassword"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ width: "270px" }}
                className={
                  formik.errors.currentPassword &&
                  formik.touched.currentPassword
                    ? "input-error"
                    : "password"
                }
              />
              {formik.errors.currentPassword &&
                formik.touched.currentPassword && (
                  <p className="error-message-change-username">
                    {formik.errors.currentPassword}
                  </p>
                )}

              <input
                type="password"
                placeholder="New password"
                id="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ width: "270px" }}
                className={
                  formik.errors.newPassword && formik.touched.newPassword
                    ? "input-error"
                    : "password"
                }
              />
              {formik.errors.newPassword && formik.touched.newPassword && (
                <p className="error-message-change-username">
                  {formik.errors.newPassword}
                </p>
              )}

              <input
                type="password"
                placeholder="Confirm new password"
                id="confirmNewPassword"
                value={formik.values.confirmNewPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ width: "270px" }}
                className={
                  formik.errors.confirmNewPassword &&
                  formik.touched.confirmNewPassword
                    ? "input-error"
                    : "password"
                }
              />
              {formik.errors.confirmNewPassword &&
                formik.touched.confirmNewPassword && (
                  <p className="error-message-change-username">
                    {formik.errors.confirmNewPassword}
                  </p>
                )}
            </Modal>

            <Modal
              title="Change Username"
              bodyStyle={{ backgroundColor: "#303952" }}
              open={openUsername}
              onOk={handleSubmit}
              confirmLoading={confirmLoadingUsername}
              onCancel={handleCancelUsername}
            >
              <input
                type="text"
                placeholder="Username"
                id="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ width: "270px" }}
                className={
                  errors.username && touched.username
                    ? "input-error"
                    : "username"
                }
              />
              {errors.username && touched.username && (
                <p className="error-message-change-username">
                  {errors.username}
                </p>
              )}
            </Modal>
          </div>)}
          </div>
          <div className="chenar-stats">
            {pageLoading ? (
              <div className="loading-locked-statistics">
                <Spin indicator={antIcon} />
              </div>
            ) : (
              <>
                {statisticsLocked ? (
                  <>
                    <div className="loading-locked-statistics">
                      <p className="chenar-stats-locked-text">
                        Statistics are locked until you play a game of each mode
                      </p>
                    </div>
                  </>
                ) : (
                  <>
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
                                    (easy22correct /
                                      (easy22correct + easy22wrong)) *
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
                        <p className="remaining-text">
                          Remaining to guess: {161 - easy22correct}/161
                        </p>
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
                                    (hard22correct /
                                      (hard22correct + hard22wrong)) *
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
                        <p className="remaining-text">
                          Remaining to guess: {161 - hard22correct}/161
                        </p>
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
                                    (easy44correct /
                                      (easy44correct + easy44wrong)) *
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
                        <p className="remaining-text">
                          Remaining to guess: {161 - easy44correct}/161
                        </p>
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
                                    (hard44correct /
                                      (hard44correct + hard44wrong)) *
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
                        <p className="remaining-text">
                          Remaining to guess: {161 - hard44correct}/161
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="chenar-history">
          <Table
            columns={columns}
            dataSource={loadingTable ? [] : data_history}
            rowClassName={(record, index) =>
              record.correct_wrong === "Wrong"
                ? "table-row-wrong"
                : "table-row-correct"
            }
            bordered={true}
          />
        </div>
      </div>
    </>
  );
}

export default Profile;
