import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import { XYPlot, LineSeries, Hint, XAxis, YAxis } from "react-vis";
import "../node_modules/react-vis/dist/style.css";
import { useLocation } from "react-router-dom";
import moment from "moment";
const percentChangeIcons = [
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="down-arrow"
      className="h-6 w-6"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
        clipRule="evenodd"
      />
    </svg>,
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="up-arrow"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
        clipRule="evenodd"
      />
    </svg>,
  ];

export default function Chart() {
  const [hintValue, setHint] = useState("");
  const [dailyPrices, setDailyPrices] = useState([]);
  const [showDaily, setShowDaily] = useState(false);
  const _onMouseLeave = () => {
    setHint("");
  };

  const _onNearestX = (value) => {
    setHint(value);
  };

  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/${state.asset.id}/market_chart?vs_currency=usd&days=1`
    )
      .then((res) => res.json())
      .then((data) => {
        setDailyPrices(data.prices);
      });
  }, []);

  console.log(dailyPrices);
  const { state } = useLocation();

  const loopData = () => {
    let data = [];
    for (let i = 0; i < state.prices.length; i++) {
      data.push({ x: new Date(state.prices[i][0]), y: state.prices[i][1] });
    }
    console.log(data);
    return data;
  };

  const graphColor = () => {
    return state.prices[state.prices.length - 1][1] > state.prices[0][1]
      ? "green"
      : "red";
  };

  const percentChange = (percent) => {
    let s = percent.toString();

    return s.includes("-") ? (
      <div className="p-change-neg">
        {percentChangeIcons[0]}
        {s.replace("-", "").slice(0, 4)}%
        </div>
    ) : (
      <div className="p-change-pos">
        {percentChangeIcons[1]}
        {s.slice(0, 5)}%
      </div>
    );
  };

  const dailyChart = () => {
    setShowDaily(!showDaily);
    loopDailyData();
  };

  const loopDailyData = () => {
    let dailyData = [];
    for (let i = 0; i < dailyPrices.length; i++) {
      dailyData.push({ x: new Date(dailyPrices[i][0]), y: dailyPrices[i][1] });
    }
    return dailyData;
  };
  return (
    <div className="chart-page-container">
      
      <div className="chart-asset-info">
      <div className="current-price">
     <h1>Current price: <data>$ {state.asset.current_price.toLocaleString()}</data></h1>
     {percentChange(state.asset.price_change_percentage_24h)}
          </div>
          <div className="chart-asset-header">
          <img src={state.asset.image}></img>
        <h1> {state.asset.id.replace(state.asset.id.charAt(0), state.asset.id.charAt(0).toUpperCase())}</h1>
        <h1>{state.asset.symbol.toUpperCase()}</h1>
        </div>
      </div>
      {showDaily === false ? (
          <div className="chart">
        <XYPlot
          xType="time"
          onMouseLeave={_onMouseLeave}
          height={500}
          width={700}
        >
          <YAxis
            tickFormat={(v) => `${v.toString().slice(0, 2)}K`}
            title="Price"
          ></YAxis>
          <XAxis title="Date"></XAxis>
          <LineSeries
            onNearestXY={_onNearestX}
            color={"blue"}
            className="line"
            data={loopData()}
          />
          <Hint value={hintValue}>
            <div style={{ background: "black" }}>
              <p>{hintValue.y} </p>
              <p>{moment(hintValue.x).format("MMM Do YY")}</p>
            </div>
          </Hint>
        </XYPlot></div>
      ) : (
        <XYPlot
          xType="time"
          onMouseLeave={_onMouseLeave}
          height={500}
          width={700}
        >
          <YAxis tickFormat={(v) => `${v.toString().slice(0, 2)}K`} title="Price"></YAxis>
          <XAxis title="Time"></XAxis>
          <LineSeries
            onNearestXY={_onNearestX}
            color={"blue"}
            className="line"
            data={loopDailyData()}
          />
          <Hint value={hintValue}>
            <div style={{ background: "black" }}>
              <p>{hintValue.y} </p>
              <p>{moment(hintValue.x).calendar()}</p>
            </div>
          </Hint>
        </XYPlot>
      )}
      <button onClick={() => dailyChart()}>Daily Chart</button>
    </div>
  );
}
