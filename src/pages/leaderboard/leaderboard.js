import Menu from  "../../fragments/menu/menu"
import React, { useState, useEffect } from 'react';
import Axios from "axios";
import "./leaderboard.css"
import { Switch, Table } from 'antd';
import "antd/lib/table/style/index.css";
import "antd/lib/pagination/style/index.css";
import { useNavigate } from "react-router-dom";
import "antd/lib/select/style/index.css";
import bronze from "../profile/ranks/bronze.webp"
import silver from "../profile/ranks/silver.webp"
import gold from "../profile/ranks/gold.webp"
import platinum from "../profile/ranks/platinum.webp"
import diamond from "../profile/ranks/diamond.webp"
import master from "../profile/ranks/master.webp"
import challenger from "../profile/ranks/challenger.webp"
import { Spin } from "antd";
import "antd/lib/spin/style/index.css";
import { LoadingOutlined } from "@ant-design/icons";

let data_leaderboard = [];
function Leaderboard() {
  const navigate = useNavigate();

  const [loadingTable, setLoadingTable] = useState(true);

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
      title: 'Place',
      dataIndex: 'place',
      key: '1',
      width: 40,
      align: 'center',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: '2',
      width: 140,
      align: 'center',
      render: (record) => {
        return (<>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '35px'}}><img style = {{width: '45px', marginRight: '6px'}} src={`data:image;base64,${record.pfp_src}`}></img>{record.username}</div>

        </>)
      }
    },
    {
      title: 'Rank | RP',
      dataIndex: 'rank_points',
      key: '3',
      width: 140,
      height: 50,
      align: 'center',
      render: (record) => {
        return (<>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '35px'}}><img style = {{width: '65px', marginLeft: '-10px', marginRight: '10px'}} src={record.rank}></img>{record.rank_points}</div>
        </>)
      }
    },
    {
      title: 'Easy 2x2 correct rate',
      dataIndex: 'easy22',
      key: '4',
      width: 130,
      align: 'center',
    },
    {
      title: 'Hard 2x2 correct rate',
      dataIndex: 'hard22',
      key: '5',
      width: 130,
      align: 'center',
    },
    {
      title: 'Easy 4x4 correct rate',
      dataIndex: 'easy44',
      key: '6',
      width: 130,
      align: 'center',
    },
    {
      title: 'Hard 4x4 correct rate',
      dataIndex: 'hard44',
      key: '7',
      width: 130,
      align: 'center',
    },
    
  ];

  useEffect(() => {

    fetchLeaderboard();

  }, []);

  
  const fetchLeaderboard = async () => {
    const response = await Axios.get("https://daniel-licenta-api.herokuapp.com/leaderboard");
    
    data_leaderboard = [];
    let rankpoints;
    let rank;
    let place = 0;
      for (let i = 0; i < response.data.result.length; i++) {
        rankpoints = response.data.result[i].rank_points;

        if(rankpoints > 0 && rankpoints < 53){
          rank = bronze
        }
          
        else if(rankpoints >= 53 && rankpoints < 141){
          rank = silver
        }
          
        else if(rankpoints >= 141 && rankpoints < 317){
          rank = gold
        }
          
        else if(rankpoints >= 317 && rankpoints < 601){
          rank = platinum
        }
          
        else if(rankpoints >= 601 && rankpoints < 1061){
          rank = diamond
        }
          
        else if(rankpoints >= 1061 && rankpoints < 1771){
          rank = master
        }
          
        else if(rankpoints == 1771){
          rank = challenger
        }
        let easy22 = (response.data.result[i].easy22correct /
          (response.data.result[i].easy22correct + response.data.result[i].easy22wrong)) *
        100
        let hard22 = (response.data.result[i].hard22correct /
        (response.data.result[i].hard22correct + response.data.result[i].hard22wrong)) *
      100
        let easy44 = (response.data.result[i].easy44correct /
        (response.data.result[i].easy44correct + response.data.result[i].easy44wrong)) *
      100
        let hard44 = (response.data.result[i].hard44correct /
        (response.data.result[i].hard44correct + response.data.result[i].hard44wrong)) *
      100

        if(!isNaN(easy22) && !isNaN(hard22) && !isNaN(easy44) && !isNaN(hard44)){
          place++;
          data_leaderboard.push({
            key: i,
            place: place,
            username:{username: response.data.result[i].username,
            pfp_src: (response.data.result2.find(({ pfp_name }) => pfp_name === response.data.result[i].pfp)).src},
            rank_points: {rank_points : response.data.result[i].rank_points,
              rank: rank},
            background: response.data.result[i].background_leaderboard,
            easy22: easy22.toFixed(2) +
            "%",
            hard22: hard22.toFixed(2) +
            "%",
            easy44: easy44.toFixed(2) +
            "%",
            hard44: hard44.toFixed(2) +
            "%",
          });
        }
        
      }

    setLoadingTable(false);
  }



  return (
    <>
      <Menu />

      <div style={{ width: 1100, margin: "4% auto" }}>
        {loadingTable ? (
          <div className="loading-locked-statistics">
            <Spin indicator={antIcon} />
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={loadingTable ? [] : data_leaderboard}
              rowClassName={(record, index) => record.background}
              bordered={true}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {navigate(`/users/profile/${record.username.username}`)}, // click row
                };
              }}
            />
          </>
        )}
      </div>
    </>
  );

}

export default Leaderboard;