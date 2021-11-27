import "./scss/landingPage.css";
import logo from "../img/tesodev-logo.svg";
import line from "../img/line-1.png";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  const [info, setInfo] = useState([]);
  const [showInfo, setshowInfo] = useState(3);
  const [text, setText] = useState("");
  const [filterValue, setFilterValue] = useState("");

  let one = "http://localhost:8000/data";
  let two = "http://localhost:8000/cols";
  const requestOne = axios.get(one);
  const requestTwo = axios.get(two);

  useEffect(() => {
    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...res) => {
          /* Destek aldım. Bu kodu yazmak için. */
          setInfo(
            res[0].data.map((item) => {
              return item.reduce((itemObj, value, index) => {
                const key = res[1].data[index];
                itemObj[key] = value;
                return itemObj;
              }, {});
            })
          );
        })
      )
      .catch((error) => console.log({ error }));
  }, []);

  const handleSearch = () => {
    if (text === "") {
      alert("Değer boş olamaz!!");
      setFilterValue(text);
    } else {
      setFilterValue(text);
    }
  };

  const showMore = () => {
    showInfo === 3 ? setshowInfo(info.length) : setshowInfo(3);
  };

  return (
    <div className="component--landingPage">
      <div className="header">
        <img src={logo} alt="logo" />
        <h6>Search web app</h6>
      </div>
      <div className="content">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="btn-dark"
            onClick={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            Search
          </button>
        </div>
        <div className="search-results">
          <ul>
            {info
              .filter((el) =>
                el["Name Surname"]
                  .toLowerCase()
                  .includes(filterValue.toLowerCase())
              )
              .slice(0, showInfo)
              .map((item, index) => {
                return (
                  <li key={index}>
                    <a href="/">
                      <span className="result">
                        <span className="info">
                          {item.Country} - {item.City}
                        </span>
                        <span className="email">Email: {item.Email} </span>
                      </span>
                      <span className="title">
                        {item["Name Surname"]} - {item.Date}
                      </span>
                      <img className="line" src={line} alt="" />
                    </a>
                  </li>
                );
              })}
          </ul>
          {/*      <Link to="/search-list" className="show-more" onClick={showMore}> */}
          <Link to="/search-list" className="show-more" onClick={showMore}>
            {showInfo === 3 ? "Show More" : "Show Less"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
