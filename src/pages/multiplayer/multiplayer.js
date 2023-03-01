import Menu from "../../fragments/menu/menu";
import "./multiplayer.css";
import Axios from "axios";
import { useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { notification } from "antd";
import "antd/lib/notification/style/index.css";
import { Switch } from "antd";
import "antd/lib/switch/style/index.css";
import { Modal } from "antd";
import "../profile/antdCss/modal_button.css";
import backButton from "../play/back-button.png";
import FlipNumbers from "react-flip-numbers";
import { Table } from 'antd';
import { motion } from "framer-motion";
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
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
const ENDPOINT = "http://localhost:3001";
const socket = io(ENDPOINT);
let champions = [];

let data_rooms_available = [];
function Multiplayer() {
  const navigate = useNavigate();
  //for easy22 and hard22
  const [filter, setFilter] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible22, setIsVisible22] = useState([false, false, false, false]);
  const [isVisible44, setIsVisible44] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [key, setKey] = useState(0);
  useEffect(() => {
    socket.emit("roomsAvailable");
    const fetchChampions = async () => {
      const response = await Axios.get(
        "http://localhost:3001/champion-options"
      );
      champions = response.data;
    };
    fetchChampions();
    // eslint-disable-next-line
  }, []);
  //done
  const [roomCode, setRoomCode] = useState(null);
  const [mode, setMode] = useState("home");
  const [roomInput, setRoomInput] = useState("");
  const [champion, setChampion] = useState("");
  const [dificulty, setDificulty] = useState("");
  const [goodToChoose, setGoodToChoose] = useState(true);
  const [player1score, setPlayer1score] = useState(0);
  const [player2score, setPlayer2score] = useState(0);
  const [player1correct, setPlayer1correct] = useState(0);
  const [player1wrong, setPlayer1wrong] = useState(0);
  const [player2correct, setPlayer2correct] = useState(0);
  const [player2wrong, setPlayer2wrong] = useState(0);
  const [player1Username, setPlayer1Username] = useState(0);
  const [player1Pfp, setplayer1Pfp] = useState(0);
  const [player2Username, setPlayer2Username] = useState(0);
  const [player2Pfp, setplayer2Pfp] = useState(0);
  const [seconds22, setSeconds22] = useState("");
  const [seconds44, setSeconds44] = useState("");
  const [password, setPassword] = useState(null);
  const [chooseDificultyEasy22, setChooseDificultyEasy22] = useState(true);
  const [chooseDificultyEasy44, setChooseDificultyEasy44] = useState(true);
  const [chooseDificultyHard22, setChooseDificultyHard22] = useState(true);
  const [chooseDificultyHard44, setChooseDificultyHard44] = useState(true);
  const [boolPassword, setBoolPassword] = useState(false);
  const inputRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoadingModal, setConfirmLoadingModal] = useState(false);
  const [totalRooms, setTotalRooms] = useState([]);

  const columns = [
    {
      title: 'Room Code',
      dataIndex: 'room_code',
      key: '1',
      width: 140,
      align: 'center',
    },
    {
      title: 'Host',
      dataIndex: 'host',
      key: '2',
      width: 140,
      align: 'center',
    },
    {
      title: 'Password protected',
      dataIndex: 'password',
      key: '3',
      width: 140,
      height: 300,
      align: 'center',
    },
    {
      title: 'Easy 2x2',
      dataIndex: 'easy22',
      key: '4',
      width: 140,
      align: 'center',
    },
    {
      title: 'Easy 4x4',
      dataIndex: 'easy44',
      key: '5',
      width: 140,
      align: 'center',
    },
    {
      title: 'Hard 2x2',
      dataIndex: 'hard22',
      key: '6',
      width: 140,
      align: 'center',
    },
    {
      title: 'Hard 4x4',
      dataIndex: 'hard44',
      key: '7',
      width: 140,
      align: 'center',
    },
    {
      title: 'Seconds 2x2',
      dataIndex: 'seconds22',
      key: '8',
      width: 140,
      align: 'center',
    },
    {
      title: 'Seconds 4x4',
      dataIndex: 'seconds44',
      key: '9',
      width: 140,
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: '10',
      width: 140,
      align: 'center',
    },
    
  ];

  useEffect(() => {
    socket.on("roomsAvailable", (data) => {
      data_rooms_available = [];
      setTotalRooms(data)
      for(const room in data){
        data_rooms_available.push({
          key: room,
          room_code: data[room].roomCode,
          host: data[room].host,
          password: data[room].password,
          easy22: data[room].easy22,
          easy44: data[room].easy44,
          hard22: data[room].hard22,
          hard44: data[room].hard44,
          seconds22: data[room].seconds22,
          seconds44: data[room].seconds44,
          status: data[room].status,
        })
      }
    });

    socket.on("roomCreated", (code) => {
      setRoomCode(code);
      setMode("waiting");
    });

    socket.on("roomJoined", (code) => {
      setRoomCode(code);
      setMode("playing");
    });

    socket.on("passwordRequired", () => {
      setOpenModal(true);
    });

    socket.on("playerJoined", (id) => {
      notification["info"]({
        message: `Player ${id} has joined your room`,
      });
      setMode("playing");
    });

    socket.on("invalidRoom", () => {
      notification["error"]({
        message: "Invalid room code",
      });
    });

    socket.on("incorrectPassword", () => {
      setConfirmLoadingModal(false);
      notification["error"]({
        message: "Password is incorrect",
      });
    });

    socket.on("roomFull", () => {
      notification["error"]({
        message: "Room is full",
      });
    });

    socket.on("newChampion", (data) => {
      setConfirmLoadingModal(false);
      setOpenModal(false);
      setChampion(data.champion.championSelectedSrc);
      setDificulty(data.champion.dificulty);
      setSeconds22(data.seconds22);
      setSeconds44(data.seconds44);
      setPlayer1Username(data.player1Username);
      setPlayer2Username(data.player2Username);
      setplayer1Pfp(data.user1Pfp);
      setplayer2Pfp(data.user2Pfp);
    });

    socket.on("newChampionVisible", (data) => {
      if (data.length === 4) setIsVisible22(data);
      else setIsVisible44(data);
      setGoodToChoose(false);
    });

    socket.on("newChampionNewGame", (data) => {
      if (data.text) {
        notification["info"]({
          message: data.text,
        });
      }
      if (data.visibilityData.length === 4) setIsVisible22(data.visibilityData);
      else setIsVisible44(data.visibilityData);
      setChampion(data.champion.championSelectedSrc);
      setDificulty(data.champion.dificulty);
      setKey((prevKey) => prevKey + 1);
    });

    socket.on("wrongAnswerP1", (data) => {
      setPlayer1wrong(data.p1wrong);
      setPlayer2wrong(data.p2wrong);
      setFilter("");
      notification[data.type]({
        message: data.error,
      });
    });

    socket.on("wrongAnswerP2", (data) => {
      setPlayer1wrong(data.p1wrong);
      setPlayer2wrong(data.p2wrong);
      notification[data.type]({
        message: data.error,
      });
    });

    socket.on("correctAnswerP1", (data) => {
      setPlayer1correct(data.p1correct);
      setPlayer2correct(data.p2correct);
      setPlayer1score(data.p1score);
      setPlayer2score(data.p2score);
      setFilter("");
      notification[data.type]({
        message: data.text,
        description: data.description,
      });
    });

    socket.on("correctAnswerP2", (data) => {
      setPlayer1correct(data.p1correct);
      setPlayer2correct(data.p2correct);
      setPlayer1score(data.p1score);
      setPlayer2score(data.p2score);
      setFilter("");
      notification[data.type]({
        message: data.text,
        description: data.description,
      });
    });

    socket.on("gameOverStats", (data) => {
      notification[data.type]({
        message: data.message,
      });
      setMode("gameOver");
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const resetEverything = () => {
    setFilter("");
    setIsVisible(false);
    setIsVisible22([false, false, false, false]);
    setIsVisible44([
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
    setRoomCode(null);
    setRoomInput("");
    setChampion("");
    setDificulty("");
    setGoodToChoose(true);
    setPlayer1score(0);
    setPlayer2score(0);
    setPlayer1correct(0);
    setPlayer1wrong(0);
    setPlayer2correct(0);
    setPlayer2wrong(0);
    setPlayer1Username(0);
    setplayer1Pfp(0);
    setPlayer2Username(0);
    setplayer2Pfp(0);
    setSeconds22("");
    setSeconds44("");
    setPassword(null);
    setChooseDificultyEasy22(true);
    setChooseDificultyEasy44(true);
    setChooseDificultyHard22(true);
    setChooseDificultyHard44(true);
    setBoolPassword(false);
  };

  function handleDisconnectClick() {
    socket.emit("gameOver", {
      roomCode: roomCode,
    });
  }

  function handleBackToHome() {
    resetEverything();
    setMode("home");
  }

  const roomSettings = () => {
    
    setMode("roomSettings");
  };

  const createRoom = () => {

    const onlyNumbers = /^\d+$/;
    if (
      (!chooseDificultyEasy22 &&
        !chooseDificultyEasy44 &&
        !chooseDificultyHard22 &&
        !chooseDificultyHard44) ||
      ((chooseDificultyEasy22 || chooseDificultyHard22) &&
        (seconds22 === "" || seconds22 <= 0 || !onlyNumbers.test(seconds22))) ||
      ((chooseDificultyEasy44 || chooseDificultyHard44) &&
        (seconds44 === "" || seconds44 <= 0 || !onlyNumbers.test(seconds44)))
    ) {
      notification["error"]({
        message: "Invalid Room Settings",
      });
    } else
      socket.emit("createRoom", {
        token: localStorage.getItem("token"),
        easy22: chooseDificultyEasy22,
        easy44: chooseDificultyEasy44,
        hard22: chooseDificultyHard22,
        hard44: chooseDificultyHard44,
        password: password,
        seconds22: seconds22,
        seconds44: seconds44,
      });
  };

  const joinRoom = () => {
    if (openModal === true) setConfirmLoadingModal(true);
    socket.emit("joinRoom", {
      roomCode: roomInput,
      token: localStorage.getItem("token"),
      password: password,
    });
  };

  const joinRoomOnTable = (data) => {
    setRoomInput(data)
    if (openModal === true) setConfirmLoadingModal(true);
    socket.emit("joinRoom", {
      roomCode: data,
      token: localStorage.getItem("token"),
      password: password,
    });
  };

  const gameInProgress = () => {
    socket.emit("gameInProgress", {
      roomCode: roomCode,
      goodToChoose: goodToChoose,
      dificulty: dificulty,
    });
  };

  const newChampion = () => {
    socket.emit("newChampion", { roomCode: roomCode });
  };

  const checkAnswer = (ans, e) => {
    e.preventDefault();
    socket.emit("checkAnswer", {
      roomCode: roomCode,
      answer: ans.toLowerCase(),
      championsToCheck: champions,
    });
    inputRef.current.focus();
  };

  const allTrue = (arr) => {
    for (var i = 0; i < arr.length; i++) {
      if (!arr[i]) {
        return false;
      }
    }
    return true;
  };

  const checkDisplay22 = () => {
    if (chooseDificultyEasy22 === true || chooseDificultyHard22 === true) {
      return (
        <>
          <p style={{ width: "250px", textAlign: "center" }}>
            In how many seconds will a new piece of image appear for 2 x 2:{" "}
          </p>
          <input
            type="text"
            className="inputSeconds"
            placeholder="Ex: 4"
            value={seconds22}
            onChange={(e) => setSeconds22(e.target.value)}
          />
        </>
      );
    }
  };

  const checkDisplay44 = () => {
    if (chooseDificultyEasy44 === true || chooseDificultyHard44 === true) {
      return (
        <>
          <p style={{ width: "250px", textAlign: "center" }}>
            In how many seconds will a new piece of image appear for 4 x 4:{" "}
          </p>
          <input
            type="text"
            className="inputSeconds"
            placeholder="Ex: 2"
            value={seconds44}
            onChange={(e) => setSeconds44(e.target.value)}
          />
        </>
      );
    }
  };

  const renderTime = ({ remainingTime }) => {
    return (
      <div className="timer">
        <div className="value">{remainingTime}</div>
      </div>
    );
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const filteredChampions = champions.filter(
        (f) =>
          f.startsWith(
            filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase()
          ) && filter !== ""
      );
      if (filteredChampions.length > 0) {
        const firstChampion = filteredChampions[0];
        checkAnswer(firstChampion, event);
      }
    }
  };

  const data1 = {
    labels: ["Correct", "Wrong"],
    datasets: [
      {
        data: [player1correct, player1wrong],
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
        data: [player2correct, player2wrong],
        backgroundColor: ["rgba(54, 162, 235, 0.4)", "rgba(255, 99, 132, 0.4)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  if (mode === "home") {
    return (
      <div>
        <Menu />
        <img
          className="backButtonM"
          style={{ width: "60px", height: "60px", display: "flex", margin: "0 auto", marginTop: "2%" }}
          src={backButton}
          onClick={() => {navigate("/play")}}
        ></img>
        <div className={(totalRooms.length === 0) ? "containerHomeRoomWaiting":"containerHomeRoom"}>
          {totalRooms.length === 0 ? 
          <>
          <h2 className="titleRoomSettings">No rooms available. Instead you can:</h2>
          <button className="homeButtonsRoom" onClick={roomSettings}>
            Create Room
          </button>
          </> 
          : 
          <>
          <div className="containerHomeRoom2">
          <button className="homeButtonsRoom" onClick={roomSettings}>
            Create Room
          </button>
          <div className="containerJoin">
            <input
              type="text"
              placeholder="Room Code"
              className="inputSeconds"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
            />
            <button className="homeButtonsRoom" onClick={joinRoom}>
              Join Room
            </button>
            </div>
          </div>

          <Table
              columns={columns}
              dataSource={[...data_rooms_available]}
              bordered={true}
              rowClassName={"rowRooms"}
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => {joinRoomOnTable(record.room_code)},
                };
              }}
            />
          </>}
          
          <Modal
            title="Password to join room"
            bodyStyle={{ backgroundColor: "#303952" }}
            open={openModal}
            onOk={joinRoom}
            confirmLoading={confirmLoadingModal}
            onCancel={() => setOpenModal(false)}
          >
            <input
              type="text"
              placeholder="Password for the Room"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Modal>
        </div>
      </div>
    );
  } else if (mode === "roomSettings") {
    return (
      <>
        <Menu />
        <img
            className="backButtonM"
            style={{ width: "60px", height: "60px", display: "flex", margin: "0 auto", marginTop: "2%" }}
            src={backButton}
            onClick={() => setMode("home")}
          ></img>
        <div className="containerRoomSettings">
          <h2 className="titleRoomSettings">Room Settings</h2>
          <div className="difficulty">
            <p>Easy 22:</p>
            <Switch
              defaultChecked
              onChange={() => setChooseDificultyEasy22(!chooseDificultyEasy22)}
            />
          </div>

          <div className="difficulty">
            <p>Easy 44:</p>
            <Switch
              defaultChecked
              onChange={() => setChooseDificultyEasy44(!chooseDificultyEasy44)}
            />
          </div>

          <div className="difficulty">
            <p>Hard 22:</p>
            <Switch
              defaultChecked
              onChange={() => setChooseDificultyHard22(!chooseDificultyHard22)}
            />
          </div>

          <div className="difficulty">
            <p>Hard 44:</p>
            <Switch
              defaultChecked
              onChange={() => setChooseDificultyHard44(!chooseDificultyHard44)}
            />
          </div>

          <div className="difficulty">
            <p>Password:</p>
            <Switch
              defaultChecked={false}
              onChange={() => {
                setBoolPassword(!boolPassword);
                setPassword(null);
              }}
            />
          </div>
          {boolPassword ? (
            <input
              type="text"
              className="inputSeconds"
              placeholder="Password for the Room"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          ) : null}
          {/* display seconds for 22 */}
          {checkDisplay22()}
          {/* display seconds for 44 */}
          {checkDisplay44()}
          <button className="createRoomBtn" onClick={createRoom}>
            Create Room
          </button>
        </div>
      </>
    );
  } else if (mode === "waiting") {
    return (
      <div>
        <Menu />
        <img
          className="backButtonM"
          style={{ width: "60px", height: "60px", display: "flex", margin: "0 auto", marginTop: "2%" }}
          src={backButton}
          onClick={handleBackToHome}
        ></img>
        <div className="containerWaiting">
          <h2 className="titleWaitingRoom">Room code: {roomCode}</h2>
          <div style={{ display: "flex" }}>
            {"Waiting  for  other  players..."
              .split("")
              .map((letter, index) => (
                <motion.span
                  key={index}
                  style={{ display: "inline-block", marginRight: "0.2em" }}
                  animate={{ y: [0, -4, 2, 0] }}
                  transition={{
                    duration: 0.75,
                    ease: "easeInOut",
                    delay: index * 0.1,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 5,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
          </div>
        </div>
      </div>
    );
    //easy22 and hard22 playing
  } else if (
    mode === "playing" &&
    (dificulty === "easy22" || dificulty === "hard22")
  ) {
    gameInProgress();
    return (
      <div className="bigWrapper">
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: 'center',
            width: "90%",
          }}
        >
          <div className="containerPlayers">
            <div className="containerPlayersColumn">
              <img
                style={{ width: "120px" }}
                src={`data:image;base64,${player1Pfp}`}
              ></img>
              <h2>{player1Username}</h2>
            </div>
            <div className="pieChartM">
              <Pie
                data={data1}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text:
                        "Correct answer rate: " +
                        (
                          (player1correct / (player1correct + player1wrong)) *
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

            <div className="containerPlayersColumn">
              <p className="score">Score</p>
              <FlipNumbers
                height={28}
                width={19}
                play={true}
                duration={1}
                perspective={500}
                numbers={`${player1score}`}
              />
            </div>
          </div>
          <img
            className="backButtonM"
            style={{ width: "60px", height: "60px" }}
            src={backButton}
            onClick={handleDisconnectClick}
          ></img>
          <div className="containerPlayers">
            <div className="containerPlayersColumn">
              <img
                style={{ width: "120px" }}
                src={`data:image;base64,${player2Pfp}`}
              ></img>
              <h2>{player2Username}</h2>
            </div>
            <div className="pieChartM">
              <Pie
                data={data2}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text:
                        "Correct answer rate: " +
                        (
                          (player2correct / (player2correct + player2wrong)) *
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
            <div className="containerPlayersColumn">
              <p className="score">Score</p>
              <FlipNumbers
                height={28}
                width={19}
                play={true}
                duration={1}
                perspective={500}
                numbers={`${player2score}`}
              />
            </div>
          </div>
        </div>

        <div className="wrapper">
          <div className="answers-listM">
            <div className="answersM">
              <CountdownCircleTimer
                key={key}
                isPlaying
                size={100}
                strokeWidth={8}
                duration={seconds22}
                colors={["#1dc054", "#bac01d", "#c0811d", "#c01d1d", "#c01d1d"]}
                colorsTime={[
                  seconds22,
                  seconds22 * 0.65,
                  seconds22 * 0.4,
                  seconds22 * 0.15,
                  0,
                ]}
                onComplete={() => {
                  if (allTrue(isVisible22)) {
                    setIsVisible22([false, false, false, false]);
                    newChampion();
                  }
                  setGoodToChoose(true);
                  return { shouldRepeat: true }; // repeat animation in 1.5 seconds
                }}
              >
                {renderTime}
              </CountdownCircleTimer>

              <input
                id="filter"
                placeholder="Type champion name..."
                name="filter"
                type="textt"
                value={filter}
                ref={inputRef}
                onChange={(event) => setFilter(event.target.value)}
                autoComplete="off"
                onFocus={() => setIsVisible(true)}
                onKeyDown={handleEnter}
              />
              <div style={{ width: "100px", height: "100px" }}></div>
            </div>

            <ul>
              <div
                className="listaM"
                style={{
                  visibility: isVisible ? "visible" : "hidden",
                }}
              >
                {champions
                  ?.filter(
                    (f) =>
                      f.startsWith(
                        filter.charAt(0).toUpperCase() +
                          filter.slice(1).toLowerCase()
                      ) && filter !== ""
                  )
                  .map((f) => (
                    <button
                      key={f}
                      onClick={(event) => {
                        checkAnswer(f, event);
                      }}
                      className="guess-word"
                    >
                      <span>{f}</span>{" "}
                    </button>
                  ))}
              </div>
            </ul>
          </div>

          <div className="grid" style={{ pointerEvents: "none" }}>
            <div className="gridimg">
              <img
                className="img1"
                style={{ visibility: isVisible22[0] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg">
              <img
                className="img2"
                style={{ visibility: isVisible22[1] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg">
              <img
                className="img3"
                style={{ visibility: isVisible22[2] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg">
              <img
                className="img4"
                style={{ visibility: isVisible22[3] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else if (
    mode === "playing" &&
    (dificulty === "easy44" || dificulty === "hard44")
  ) {
    gameInProgress();
    return (
      <div className="bigWrapper">
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: 'center',
            width: "90%",
          }}
        >
          <div className="containerPlayers">
            <div className="containerPlayersColumn">
              <img
                style={{ width: "120px" }}
                src={`data:image;base64,${player1Pfp}`}
              ></img>
              <h2>{player1Username}</h2>
            </div>
            <div className="pieChartM">
              <Pie
                data={data1}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text:
                        "Correct answer rate: " +
                        (
                          (player1correct / (player1correct + player1wrong)) *
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
            <div className="containerPlayersColumn">
              <p className="score">Score</p>
              <FlipNumbers
                height={28}
                width={19}
                play={true}
                duration={1}
                perspective={500}
                numbers={`${player1score}`}
              />
            </div>
          </div>
          <img
            className="backButtonM"
            style={{ width: "60px", height: "60px" }}
            src={backButton}
            onClick={handleDisconnectClick}
          ></img>
          <div className="containerPlayers">
            <div className="containerPlayersColumn">
              <img
                style={{ width: "120px" }}
                src={`data:image;base64,${player2Pfp}`}
              ></img>
              <h2>{player2Username}</h2>
            </div>
            <div className="pieChartM">
              <Pie
                data={data2}
                options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text:
                        "Correct answer rate: " +
                        (
                          (player2correct / (player2correct + player2wrong)) *
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
            <div className="containerPlayersColumn">
              <p className="score">Score</p>
              <FlipNumbers
                height={28}
                width={19}
                play={true}
                duration={1}
                perspective={500}
                numbers={`${player2score}`}
              />
            </div>
          </div>
        </div>
        <div className="wrapper">
          <div className="answers-listM">
            <div className="answersM">
              <CountdownCircleTimer
                key={key}
                isPlaying
                size={100}
                strokeWidth={8}
                duration={seconds44}
                colors={["#1dc054", "#bac01d", "#c0811d", "#c01d1d", "#c01d1d"]}
                colorsTime={[
                  seconds22,
                  seconds22 * 0.65,
                  seconds22 * 0.4,
                  seconds22 * 0.15,
                  0,
                ]}
                onComplete={() => {
                  if (allTrue(isVisible44)) {
                    setIsVisible44([
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                      false,
                    ]);
                    newChampion();
                  }
                  setGoodToChoose(true);
                  return { shouldRepeat: true }; // repeat animation in 1.5 seconds
                }}
              >
                {renderTime}
              </CountdownCircleTimer>

              <input
                id="filter"
                placeholder="Type champion name..."
                name="filter"
                type="textt"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                autoComplete="off"
                onFocus={() => setIsVisible(true)}
                onKeyDown={handleEnter}
              />
              <div style={{ width: "100px", height: "100px" }}></div>
            </div>

            <ul>
              <div
                className="listaM"
                style={{
                  visibility: isVisible ? "visible" : "hidden",
                }}
              >
                {champions
                  ?.filter(
                    (f) =>
                      f.startsWith(
                        filter.charAt(0).toUpperCase() +
                          filter.slice(1).toLowerCase()
                      ) && filter !== ""
                  )
                  .map((f) => (
                    <button
                      key={f}
                      onClick={(event) => {
                        checkAnswer(f, event);
                      }}
                      className="guess-word"
                    >
                      <span>{f}</span>{" "}
                    </button>
                  ))}
              </div>
            </ul>
          </div>

          <div className="grid44" style={{ pointerEvents: "none" }}>
            <div className="gridimg44">
              <img
                className="img144"
                style={{ visibility: isVisible44[0] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img244"
                style={{ visibility: isVisible44[1] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img344"
                style={{ visibility: isVisible44[2] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img444"
                style={{ visibility: isVisible44[3] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img544"
                style={{ visibility: isVisible44[4] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img644"
                style={{ visibility: isVisible44[5] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img744"
                style={{ visibility: isVisible44[6] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img844"
                style={{ visibility: isVisible44[7] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img944"
                style={{ visibility: isVisible44[8] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img1044"
                style={{ visibility: isVisible44[9] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img1144"
                style={{ visibility: isVisible44[10] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img1244"
                style={{ visibility: isVisible44[11] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img1344"
                style={{ visibility: isVisible44[12] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img1444"
                style={{ visibility: isVisible44[13] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img1544"
                style={{ visibility: isVisible44[14] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
            <div className="gridimg44">
              <img
                className="img1644"
                style={{ visibility: isVisible44[15] ? "visible" : "hidden" }}
                src={champion}
                alt="loading champion"
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else if (mode === "gameOver") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div className="containerPlayers">
          <div className="containerPlayersColumn">
            <img
              style={{ width: "120px" }}
              src={`data:image;base64,${player1Pfp}`}
            ></img>
            <h2>{player1Username}</h2>
          </div>
          <div className="pieChartM">
            <Pie
              data={data1}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text:
                      "Correct answer rate: " +
                      (
                        (player1correct / (player1correct + player1wrong)) *
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

          <div className="containerPlayersColumn">
            <p className="score">Score</p>
            <FlipNumbers
              height={28}
              width={19}
              play={true}
              duration={1}
              perspective={500}
              numbers={`${player1score}`}
            />
          </div>
        </div>
        <img
          className="backButtonM"
          style={{ width: "60px", height: "60px" }}
          src={backButton}
          onClick={handleBackToHome}
        ></img>
        <div className="containerPlayers">
          <div className="containerPlayersColumn">
            <img
              style={{ width: "120px" }}
              src={`data:image;base64,${player2Pfp}`}
            ></img>
            <h2>{player2Username}</h2>
          </div>
          <div className="pieChartM">
            <Pie
              data={data2}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text:
                      "Correct answer rate: " +
                      (
                        (player2correct / (player2correct + player2wrong)) *
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
          <div className="containerPlayersColumn">
            <p className="score">Score</p>
            <FlipNumbers
              height={28}
              width={19}
              play={true}
              duration={1}
              perspective={500}
              numbers={`${player2score}`}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Multiplayer;
