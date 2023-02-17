import Menu from  "../../fragments/menu/menu"
import "./home.css";
import Axios from "axios";
import { useState, useEffect, useContext } from "react";
import { motion, useAnimation } from "framer-motion";
import lol from "./lol.webp";
import separator from "./separator.webp";
import line_under_image from "./line_under_image.webp";
import CountUp from 'react-countup';
import { useInView } from "react-intersection-observer";
import dasd from "./44-443934_post-navigation-people-icon-grey.png";
import dasdasfasd from "./question-mark.png";
const textVariants = {
  visible: { opacity: 1},
  hidden: { opacity: 0 }
};

const titleVariants = {
  visible: {
    opacity: 1,
    transition: { duration: 1 },
  },
  hidden: { opacity: 0 }
};

function Home() {

  const controls = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const controls4 = useAnimation();
  const controls5 = useAnimation();
  const controls6 = useAnimation();
  const controls7 = useAnimation();
  const controls8 = useAnimation();
  const controls9 = useAnimation();

  const [ref, inView] = useInView();
  const [ref2, inView2] = useInView();
  const [ref3, inView3] = useInView();
  const [ref4, inView4] = useInView();
  const [ref5, inView5] = useInView();
  const [ref6, inView6] = useInView();
  const [ref7, inView7] = useInView();
  const [ref8, inView8] = useInView();
  const [ref9, inView9] = useInView();
  
  const [accounts, setAccounts] = useState(0);
  const [history, setHistory] = useState(0);
  const [correctHistory, setCorrectHistory] = useState(0);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
    if (inView2) {
      controls2.start("visible");
    }
    if (inView3) {
      controls3.start("visible");
    }
    if (inView4) {
      controls4.start("visible");
    }
    if (inView5) {
      controls5.start("visible");
    }
    if (inView6) {
      controls6.start("visible");
    }
    if (inView7) {
      controls7.start("visible");
    }
    if (inView8) {
      controls8.start("visible");
    }
    if (inView9) {
      controls9.start("visible");
    }
}, [controls, inView, inView2, inView3, inView4, inView5, inView6, inView7, inView8, inView9]);

useEffect(() => {
  fetchHomeStats();
}, []);

const fetchHomeStats = async () => {
  const response = await Axios.get("https://leagueofquiz.netlify.app/home-stats");
  setAccounts(response.data.users);
  setHistory(response.data.history);
  setCorrectHistory(response.data.correct_history);
};

  return (
    <div>
      <Menu />
      <div className="homeContainer">
  <div className="home-image-chenar">
  <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 1 },
      }}
      style={{ display: "flex", justifyContent: "center" }}
    >
      {"Welcome to League of Quiz".split("").map((letter, index) => (
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: index * 0.07 } }}
        >
          <h1>{letter === " " ? "\u00a0" : letter}</h1>
        </motion.span>
      ))}
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 1 },
      }}
      style={{ display: "flex", justifyContent: "center" }}
    >
      {"Guess the Champion from the Picture".split("").map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: index * 0.07 } }}
        >
          <h3>{letter === " " ? "\u00a0" : letter}</h3>
        </motion.span>
      ))}
    </motion.div>
<motion.div
    initial={{ opacity: 0}}
    animate={{ opacity: 1}}
    transition={{ type: "spring", duration: 2.5}}
    style= {{display: 'flex', flexDirection: 'column'}}
>
  <img src={lol}></img>
  <img style={{marginTop: "10px"}} src={line_under_image}></img>


</motion.div>
  </div>
  
  <img style={{height: "80px", width:"1300px"}} src={separator}></img>
  <div className="descriptionContainer">
  <motion.div
      ref={ref}
      initial={"hidden"}
      animate={controls}
      variants={titleVariants}
      style={{ display: "flex", justifyContent: "center", marginTop: "-15px"}}
    >
      {"Challenge yourself!".split("").map((letter, index) => (
        <motion.span
          key={index}
          ref={ref}
          initial={"hidden"}
          animate={controls}
          variants={{
            visible: { y: 0, opacity: 1, transition: { delay: index * 0.07 } },
            hidden: { y: 20, opacity: 0 }
          }}
        >
          <h2>{letter === " " ? "\u00a0" : letter}</h2>
        </motion.span>
      ))}
    </motion.div>

    <motion.div
    ref={ref2}
    initial={"hidden"}
    animate={controls2}
    transition={{ type: "spring", duration: 4.5}}
    variants={textVariants}
    style= {{display: 'flex', flexDirection: 'column'}}
>
  <p>Do you consider yourself a true fan of the popular multiplayer online battle arena game League of Legends? If so, it's time to put your knowledge to the test with our challenging quiz.</p>
</motion.div>

    <motion.div
    ref={ref3}
    initial={"hidden"}
    animate={controls3}
    transition={{ type: "spring", duration: 4.5}}
    variants={textVariants}
    style= {{display: 'flex', flexDirection: 'column'}}
>
  <p>Our quiz features multiple difficulty levels, so whether you're a seasoned player or just starting out, you'll find the perfect level to challenge your skills. Take on the hardest questions for a real test of your knowledge, or start with the easier ones to warm up and build your confidence.</p>
</motion.div>

    <motion.div
    ref={ref4}
    initial={"hidden"}
    animate={controls4}
    transition={{ type: "spring", duration: 4.5}}
    variants={textVariants}
    style= {{display: 'flex', flexDirection: 'column'}}
>
  <p>So what are you waiting for? Start the Quiz Now and show the world how much you know about League of Legends! Compare your results with other players, track your progress on profile page, and climb to the top of the leaderboard. Get ready to prove yourself as the ultimate League of Legends fan!</p>
</motion.div>
  </div>
  <img style={{height: "80px", width:"1300px"}} src={separator}></img>

  <div className="howToPlayContainer">
  <motion.div
      ref={ref5}
      initial={"hidden"}
      animate={controls5}
      variants={titleVariants}
      style={{ display: "flex", justifyContent: "center", marginTop: "-15px" }}
    >
      {"How to play?".split("").map((letter, index) => (
        <motion.span
          key={index}
          ref={ref5}
          initial={"hidden"}
          animate={controls5}
          variants={{
            visible: { y: 0, opacity: 1, transition: { delay: index * 0.07 } },
            hidden: { y: 20, opacity: 0 }
          }}
        >
          <h2>{letter === " " ? "\u00a0" : letter}</h2>
        </motion.span>
      ))}
    </motion.div>

    <motion.div
    ref={ref6}
    initial={"hidden"}
    animate={controls6}
    transition={{ type: "spring", duration: 4.5}}
    variants={textVariants}
    style= {{display: 'flex', flexDirection: 'column'}}
>
<p>The first thing you need to do is create an account, you can create one here. Then use the PLAY button from the menu and select the desired difficulty.</p>
</motion.div>
<motion.div
    ref={ref7}
    initial={"hidden"}
    animate={controls7}
    transition={{ type: "spring", duration: 4.5}}
    variants={textVariants}
    style= {{display: 'flex', flexDirection: 'column'}}
>
<p>
    Our questions are based on guessing the champion in the picture, having some pieces from the whole picture. You can use hints to randomly reveal a hidden part.

    </p>
</motion.div>
<motion.div
    ref={ref8}
    initial={"hidden"}
    animate={controls8}
    transition={{ type: "spring", duration: 4.5}}
    variants={textVariants}
    style= {{display: 'flex', flexDirection: 'column'}}
>
<p>These questions are divided into 2 types of difficulty: easy and hard. On the easy difficulty you will receive a default skin for guessing, and on the hard difficulty you will receive a skin (different from the default one) for guessing and this makes the difficulty increase.
</p>
</motion.div>
<motion.div
    ref={ref9}
    initial={"hidden"}
    animate={controls9}
    transition={{ type: "spring", duration: 4.5}}
    variants={textVariants}
    style= {{display: 'flex', flexDirection: 'column'}}
>
<p>Furthermore, these 2 difficulties are divided as follows: for both difficulties, the image will be divided into 4 and 8 pieces, these being placed on a matrix of 2x2 and 4x4 respectively.</p>
</motion.div>
  </div>
  <img style={{height: "80px", width:"1300px"}} src={separator}></img>
  <div className="siteStatisticsContainer">

    <div className="statisticsContainer">
    <img style={{width: "230px"}} src={dasdasfasd}></img>
    <CountUp 
    className={"countUp"}
    end={history} 
    duration={0.005*history}
    enableScrollSpy={true}
    redraw={true}
    />
    <p>Total Guesses</p>
    </div>

    <div className="statisticsContainer">
    <img style={{width: "230px"}} src={dasd}></img>
    <CountUp 
    className={"countUp"}
    end={accounts} 
    duration={0.1*accounts}
    enableScrollSpy={true}
    redraw={true}
    />
    <p>Users Registered</p>
    </div>
    
    <div className="statisticsContainer">
    <img style={{width: "230px"}} src={dasdasfasd}></img>
    <CountUp 
    className={"countUp"}
    end={correctHistory} 
    duration={0.005*correctHistory}
    enableScrollSpy={true}
    redraw={true}
    />
    <p>Correct Guesses</p>
    </div>
  </div>
</div>
    </div>
    
  );

}

export default Home;