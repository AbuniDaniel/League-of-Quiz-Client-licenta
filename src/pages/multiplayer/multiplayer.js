import Menu from "../../fragments/menu/menu";
import "./multiplayer.css";
import Axios from "axios";
import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import answer_button from "../play/answer-button.png"
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { notification } from 'antd';
import "antd/lib/notification/style/index.css";
const ENDPOINT = "https://daniel-licenta-api.herokuapp.com";
const socket = io(ENDPOINT);
let champions = [];


function Multiplayer() {
  //for easy22 and hard22
    const [filter, setFilter] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible22, setIsVisible22] = useState([false, false, false, false]);
    const [key, setKey] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    useEffect(() => {
      const fetchChampions = async() =>{
        const response = await Axios.get("https://daniel-licenta-api.herokuapp.com/champion-options")
        champions = response.data;
      }
      fetchChampions();
  // eslint-disable-next-line
  }, []);
  //done
  const [roomCode, setRoomCode] = useState(null);
  const [mode, setMode] = useState('home');
  const [roomInput, setRoomInput] = useState('');
  const [champion, setChampion] = useState('');
  const [dificulty, setDificulty] = useState('');
  const [goodToChoose, setGoodToChoose] = useState(true);

  useEffect(() => {
    socket.on('roomCreated', code => {
      setRoomCode(code);
      setMode('waiting');
    });

    socket.on('roomJoined', code => {
      setRoomCode(code);
      setMode('playing');
    });

    socket.on('playerJoined', id => {
      notification['info']({
        message: `Player ${id} has joined your room`,
      });
      setMode('playing');
    });

    socket.on('invalidRoom', () => {
      notification['error']({
        message: 'Invalid room code',
      });
    });

    socket.on('roomFull', () => {
      notification['error']({
        message: 'Room is full',
      });
    });

    socket.on('newChampion', (data) => {
      setChampion(data.championSelectedSrc)
      setDificulty(data.dificulty)
    });

    socket.on('newChampionVisible', (data) => {
      setIsVisible22(data)
      setGoodToChoose(false)
    })

    socket.on('newChampionNewGame', (data) => {
      setIsVisible22(data.visibilityData)
      setChampion(data.champion.championSelectedSrc)
      setDificulty(data.champion.dificulty)
      setKey(prevKey => prevKey + 1)
    });

    socket.on('wrongAnswerP1', (data) => {
      setFilter('');
      notification['error']({
        message: data.error,
      });
    });

    socket.on('wrongAnswerP2', (data) => {
      notification['error']({
        message: data.error,
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = () => {
    socket.emit('createRoom', {token: localStorage.getItem("token")});
  };

  const joinRoom = () => {
    socket.emit('joinRoom', {roomCode: roomInput, token: localStorage.getItem("token")});
  };

  const gameInProgress = () => {
    socket.emit('gameInProgress', {roomCode: roomCode, goodToChoose: goodToChoose})
  }

  const newChampion = () => {
    socket.emit('newChampion', {roomCode: roomCode})
  }

  const checkAnswer = (ans) => {
    socket.emit('checkAnswer', {roomCode: roomCode, answer: ans.toLowerCase(), championsToCheck: champions})

  }

  const allTrue = (arr) => {
    for (var i = 0; i < arr.length; i++) {
      if (!arr[i]) {
        return false;
      }
    }
    return true;
  }

  if (mode === 'home') {
    return (
      <div>
        <button onClick={createRoom}>Create Room</button>
        <br />
        <br />
        <input
          type="text"
          value={roomInput}
          onChange={e => setRoomInput(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    );
  }
  else if (mode === "waiting"){
    return (
      <div>
        <p>Room code: {roomCode}</p>
        <p>Waiting for other players... 'go find some friends lol'</p>
      </div>
    );
//easy22 and hard22 playing
  } else if (mode === "playing" && (dificulty === "easy22"|| dificulty === "hard22")) {
    gameInProgress();
    return (
      <div>
        <CountdownCircleTimer
        key={key}
    isPlaying
    duration={5}
    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
    colorsTime={[5, 4, 2, 0]}
    onComplete={() => {
      if(allTrue(isVisible22)){
        setIsVisible22([false, false, false, false])
        newChampion();
      }
      setGoodToChoose(true);
      return { shouldRepeat: true} // repeat animation in 1.5 seconds
    }}
  >
    {({ remainingTime }) => remainingTime}
  </CountdownCircleTimer>
        <p>Room code: {roomCode}</p>
        <p>Game started</p>
        <div className="wrapper">
      <div className="answers-list">
      <div className="answers">
        {/* <div className="hint">
        <p className="hint-text"><FlipNumbers height={16} width={12} play={true} duration={1} perspective={70} numbers={`${hints}`} /></p>
        </div> */}
        <input id="filter"
          placeholder="Type champion name..."
          name="filter"
          type="textt"
          value={filter}
          onChange={event => setFilter(event.target.value)}
          autoComplete = "off"
          onFocus={() => setIsVisible(true)}
        />
        
        <button className="guess-button" style={{filter: isButtonDisabled ? 'brightness(70%)' : ''}} disabled={isButtonDisabled}><img src={answer_button} alt="answer_button"/></button>
      </div>

      <ul>
      <div className="lista"
      style={{
        visibility: isVisible ? 'visible' : 'hidden'
      }} >
      {champions?.filter(f => f.startsWith(filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase()) && filter !== '')
        .map(f =><button key={f} onClick={() => {checkAnswer(f); setIsVisible(false)}} className="guess-word" ><span>{f}</span> </button>)}
      </div>
      </ul>
      </div>

      <div className="grid" style={{pointerEvents: 'none'}}>
        <div className="gridimg" ><img className="img1" style={{visibility: isVisible22[0] ? 'visible' : 'hidden'}} src={champion} alt="loading champion"/></div>
        <div className="gridimg" ><img className="img2" style={{visibility: isVisible22[1] ? 'visible' : 'hidden'}} src={champion} alt="loading champion"/></div>
        <div className="gridimg" ><img className="img3" style={{visibility: isVisible22[2] ? 'visible' : 'hidden'}} src={champion} alt="loading champion"/></div>
        <div className="gridimg" ><img className="img4" style={{visibility: isVisible22[3] ? 'visible' : 'hidden'}} src={champion} alt="loading champion"/></div>
      </div>
    </div>
      </div>
    );
  }
};

export default Multiplayer;
