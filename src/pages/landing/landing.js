import React, { useEffect, useState } from "react";

import "./landing.css";
import Card from "../../components/card";
import axios from "axios";

// const localapi = "http://localhost:9000/data2";
const API = "https://heshds.netlify.app";
// const API = "";

const Movie = (props) => {
  const [data, setdata] = useState([]);
  const [source, setsource] = useState("");
  const [modalopen, setmodalopen] = useState(false);
  const [searchplayerid, setsearchplayerid] = useState("");
  const [searchplayerdata, setsearchplayerdata] = useState(null);
  const [isloading, setisloading] = useState(false);
  const [searchplayererr, setsearchplayererr] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/.netlify/functions/data2`)
      // .get(localapi)
      .then((result) => {
        // console.log(result.data.data);
        setdata(result.data.data);
        setsource(result.data.source);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fetchoneuser = () => {
    setsearchplayererr(false);
    setsearchplayerdata(null);
    setisloading(true);
    axios
      .get(`${API}/.netlify/functions/data/:id/${searchplayerid}`)
      .then((result) => {
        setisloading(false);
        if (!result.data.profile.personaname) {
          setsearchplayererr(true);
        } else {
          setsearchplayerdata(result.data);
        }
      })
      .catch((err) => {
        setisloading(false);
        setsearchplayererr(true);
        console.log(err);
      });
  };

  const sort = (value) => {
    switch (value) {
      case "mmr":
        // console.log("mmr sort");
        function mmrcomparator(a, b) {
          return (
            parseInt(b.mmr_estimate.estimate, 10) -
            parseInt(a.mmr_estimate.estimate, 10)
          );
        }

        setdata((pre) => {
          // console.log(pre.sort(mmrcomparator));
          let newArr = [...pre];
          return newArr.sort(mmrcomparator);
        });

        break;

      case "wins":
        // console.log("wins sort");
        function winscomparator2(a, b) {
          return parseInt(b.win, 10) - parseInt(a.win, 10);
        }

        setdata((pre) => {
          let newArr = [...pre];
          return newArr.sort(winscomparator2);
        });

        break;

      case "winrate":
        // console.log("wins sort");
        function winratecomparator3(a, b) {
          return (
            100 * (b.win / (b.win + b.lose)) - 100 * (a.win / (a.win + a.lose))
          );
        }

        setdata((pre) => {
          let newArr = [...pre];
          return newArr.sort(winratecomparator3);
        });

        break;

      default:
        break;
    }
  };

  return (
    <div className="maindiv">
      <header className="navbar">
        <section className="navbar-section">
          <a href="#" className="btn btn-link"></a>
        </section>{" "}
        <section className="navbar-section">
          <a href="#" className="btn btn-link"></a>
        </section>{" "}
        <section className="navbar-section">
          <a href="#" className="btn btn-link"></a>
          PROBROS
        </section>
        <section className="navbar-center">
          <img src="https://img.icons8.com/color/48/000000/dota.png" />
        </section>{" "}
        <section className="navbar-section">
          <a href="#" className="btn btn-link">
            {"                 "}
          </a>
        </section>{" "}
        <section className="navbar-section">
          <a href="#" className="btn btn-link">
            {"                 "}
          </a>
          NETWORK
        </section>
        <section className="navbar-section">
          <span className="card-subtitle">Served via {source}</span>
          <a href="#" className="btn btn-link"></a>{" "}
        </section>
      </header>

      <div className=" container">
        <div class="columns">
          <div class="column col-3">
            <div className="form-group">
              <select
                onChange={(e) => {
                  console.log(e.target.value);
                  sort(e.target.value);
                }}
                className="form-select"
              >
                <option>Sort by</option>
                <option value="mmr">MMR</option>
                <option value="wins">WINS</option>
                <option value="winrate">WINRATE</option>
              </select>
            </div>
          </div>{" "}
          <button
            className="btn btn-primary"
            onClick={() => setmodalopen(true)}
          >
            Find custom player
          </button>
        </div>

        <div className={modalopen ? "modal active" : "modal"} id="modal-id">
          <a
            href="#close"
            onClick={() => setmodalopen(false)}
            className="modal-overlay"
            aria-label="Close"
          ></a>
          <div className="modal-container">
            <div className="modal-header">
              <a
                href="#close"
                onClick={() => setmodalopen(false)}
                className="btn btn-clear float-right"
                aria-label="Close"
              ></a>
              <div className="modal-title h5">Search custom player</div>
            </div>
            <div className="modal-body">
              <div className="content">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetchoneuser();
                  }}
                >
                  <div class="form-group">
                    <label class="form-label" for="input-example-1">
                      Steam 32 ID{" "}
                      <a
                        // className=" tooltip"
                        // data-tooltip="Lorem ipsum dolor sit amet"
                        href="https://steamid.xyz/"
                        target="_blank"
                      >
                        if you don't know Steam 32 ID
                      </a>
                    </label>

                    {/* <div className="input-group"> */}
                    <div className="has-icon-right">
                      <input
                        class="form-input"
                        type="text"
                        id="input-example-1"
                        placeholder="Steam 32 ID"
                        minLength="9"
                        required
                        onChange={(e) => setsearchplayerid(e.target.value)}
                      />{" "}
                      <i hidden={!isloading} className="form-icon loading"></i>
                    </div>

                    {/* <button
                      type="submit"
                      className="btn input-group-btn"
                      // onClick={() => fetchoneuser()}
                    >
                      Search
                    </button> */}
                  </div>
                  {/* </div> */}
                </form>
                {searchplayererr && (
                  <span className="text-error">error user not found</span>
                )}
                {searchplayerdata && (
                  <Card
                    username={searchplayerdata.profile.personaname}
                    avatarurl={searchplayerdata.profile.avatarfull}
                    mmr={searchplayerdata.mmr_estimate.estimate}
                    profileurl={searchplayerdata.profile.profileurl}
                    dotaplus={searchplayerdata.profile.plus}
                    wins={searchplayerdata.win}
                    loses={searchplayerdata.lose}
                    countrycode={searchplayerdata.profile.loccountrycode}
                  />
                )}
              </div>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>

        <div className="cardstack">
          {data.length &&
            data.map((ele) => {
              return (
                <Card
                  username={ele.profile.personaname}
                  avatarurl={ele.profile.avatarfull}
                  mmr={ele.mmr_estimate.estimate}
                  profileurl={ele.profile.profileurl}
                  dotaplus={ele.profile.plus}
                  wins={ele.win}
                  loses={ele.lose}
                  countrycode={ele.profile.loccountrycode}
                />
              );
            })}
        </div>
      </div>

      <div className="footer">
        <a
          href="https://github.com/RizkyRajitha/probrosnetwork"
          target="_blank"
          rel="noopener noreferrer"
          className="footericon"
        >
          <img
            className="img-responsive"
            src="https://img.icons8.com/ios-filled/100/000000/github.png"
          />
        </a>
        <a className="footericon">
          <img
            className="img-responsive dicodbanner"
            src="https://discordapp.com/api/guilds/464811671773249536/widget.png?style=banner1"
          />{" "}
        </a>
      </div>
    </div>
  );
};

export default Movie;
