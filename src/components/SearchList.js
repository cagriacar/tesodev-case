import React, { useState, useEffect } from "react";
import "./scss/searchList.css";
import logo from "../img/tesodev-logo.svg";
import iconSort from "../img/icon-sort.png";
import line from "../img/line-1.png";
import axios from "axios";

import ReactPaginate from "react-paginate";

const SearchList = ({ itemsPerPage }) => {
  const [text, setText] = useState("");
  const [info, setInfo] = useState([]);
  const [orderBy, setOrderBy] = useState("ascendingName");
  const [eskiDeger, setEskiDeger] = useState("Name ascending");
  /* --------------------------------------- */
  const handleActive = (e) => {
    e.target.classList.add("active");
    if (e.target.textContent === eskiDeger) {
      e.target.classList.add("active");
    } else {
      const degerKontrol = document.getElementById(eskiDeger);

      degerKontrol.classList.remove("active");
      setEskiDeger(e.target.textContent);
    }
  };
  /* --------------------------------------- */
  let one = "http://localhost:8000/data";
  let two = "http://localhost:8000/cols";
  const requestOne = axios.get(one);
  const requestTwo = axios.get(two);
  /* --------------------------------------- */
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
  /* --------------------------------------- */

  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  /* --------------------------------------- */
  useEffect(() => {
    setPageCount(Math.ceil(info.length / itemsPerPage));
  });

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % info.length;

    setItemOffset(newOffset);
  };
  /* --------------------------------------- */
  /* Order by - ASC */
  const handleASC = (key) => {
    switch (key) {
      case "ascendingName":
        return (a, b) =>
          a["Name Surname"].toUpperCase() > b["Name Surname"].toUpperCase()
            ? 1
            : -1;

      case "descendingName":
        return (a, b) =>
          b["Name Surname"].toUpperCase() > a["Name Surname"].toUpperCase()
            ? 1
            : -1;

      case "ascendingYear":
        return (a, b) =>
          a["Date"].slice(6, 10) > b["Date"].slice(6, 10) ? 1 : -1;

      case "descendingYear":
        return (a, b) =>
          b["Date"].slice(6, 10) > a["Date"].slice(6, 10) ? 1 : -1;

      default:
        break;
    }
  };

  /* --------------------------------------- */
  const [filterValue, setFilterValue] = useState("");

  const handleSearch = () => {
    if (text === "") {
      alert("Değer boş olamaz!!");
      setFilterValue(text);
    } else {
      setFilterValue(text);
    }
  };
  /* --------------------------------------- */
  return (
    <div className="component--search-list">
      <div className="header">
        <img src={logo} alt="logo" />
        <div className="search--input">
          <input
            type="text"
            placeholder="Search"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="btn-ligth"
            onClick={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            Search
          </button>
        </div>
      </div>
      <div className="content">
        <div className="search--list">
          <div className="order-by">
            <img src={iconSort} alt="icon-sort" />
            <span>Order By</span>
            <div className="sort-list">
              <ul>
                <li>
                  <a
                    href="/search-list"
                    id="Name ascending"
                    className="active"
                    onClick={(e) => {
                      e.preventDefault();
                      setOrderBy("ascendingName");
                      handleActive(e);
                    }}
                  >
                    Name ascending
                  </a>
                </li>
                <li>
                  <a
                    href="/search-list"
                    id="Name descending"
                    onClick={(e) => {
                      e.preventDefault();
                      setOrderBy("descendingName");
                      handleActive(e);
                    }}
                  >
                    Name descending
                  </a>
                </li>
                <li>
                  <a
                    href="/search-list"
                    id="Year ascending"
                    onClick={(e) => {
                      e.preventDefault();
                      setOrderBy("ascendingYear");
                      handleActive(e);
                    }}
                  >
                    Year ascending
                  </a>
                </li>
                <li>
                  <a
                    href="/search-list"
                    id="Year descending"
                    onClick={(e) => {
                      e.preventDefault();
                      setOrderBy("descendingYear");
                      handleActive(e);
                    }}
                  >
                    Year descending
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <ul>
            {info
              .filter((el) =>
                el["Name Surname"]
                  .toLowerCase()
                  .includes(filterValue.toLowerCase())
              )
              .sort(handleASC(orderBy))

              .slice(itemOffset, endOffset)
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
        </div>
      </div>
      <div className="page-navigation">
        <ReactPaginate
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          pageLinkClassName="number"
          previousLinkClassName="number previous"
          nextLinkClassName="number next"
          breakLabel="..."
          breakLinkClassName="number point"
          activeLinkClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
};

export default SearchList;
