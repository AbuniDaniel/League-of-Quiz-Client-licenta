import Menu from  "../../fragments/menu/menu"
import React, { useState, useEffect } from 'react';
import Axios from "axios";
import "./userProfile.css"
import { useNavigate, useParams } from "react-router-dom";
import "antd/lib/select/style/index.css";
import unranked from "../profile/ranks/unranked.webp"
import bronze from "../profile/ranks/bronze.webp"
import silver from "../profile/ranks/silver.webp"
import gold from "../profile/ranks/gold.webp"
import platinum from "../profile/ranks/platinum.webp"
import diamond from "../profile/ranks/diamond.webp"
import master from "../profile/ranks/master.webp"
import challenger from "../profile/ranks/challenger.webp"
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

function UserProfile() {
    const param = useParams();
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

    const [profilePicture, setProfilePicture] = useState("");
    const [profilePictureSrc, setProfilePictureSrc] = useState("");
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
        fetchUserHistory();
    
      }, []);
    
      let profile, pfp, userHistory
      const myProfile = async () => {

        const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/users/info", {
          username: param.username,
        });
        setProfilePicture(response.data[0].pfp)
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
        const response2 = await Axios.get("https://daniel-licenta-api.herokuapp.com/pfp-options");
        setProfilePictureSrc((response2.data.find(({ pfp_name }) => pfp_name === response.data[0].pfp)).src)
        setPageLoading(false)
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
        const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/users/user-history" ,{
          username: param.username,
        });
        userHistory = response;
        console.log(response);

          data_history = [];
          for (let i = 0; i < response.data.length; i++) {
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
            let jsDate = new Date(response.data[i].date);
            data_history.push({
              key: i,
              game_type: checkGameType,
              user_answer: response.data[i].user_answer.charAt(0).toUpperCase() + response.data[i].user_answer.slice(1).toLowerCase(),
              correct_answer: showCorrect,
              correct_wrong: checkCorrectWrong,
              shop_points: checkShopPoints,
              bonus_hints: response.data[i].bonus,
              history_date: timeAgo(jsDate),
            });
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
              <img style={{ width: "120px" }} src={rank}></img>
              <p className="text-rp" style={{ margin: "0" }}>{`${rankPoints} RP`}</p>
            </div>
            <div style={{width: 220}}><Progress percent={`${percentage}`} size="small" status="active" /></div>
            </div>
            
            <img
              className="img-profil"
              style={{ width: "200px", height: "200px" }}
              src={`data:image;base64,${profilePictureSrc}`}
            ></img>
            
            <p className="date-created">
              Account created on: {timeAgoCreated(dataCreated3)}
            </p>
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
                        Statistics are locked until this user plays a game of each mode
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

export default UserProfile;