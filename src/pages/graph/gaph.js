import React, { useEffect, useState } from "react";
import App from "../../components/chart/line";
import "./graph.css";

const axios = require("axios");
// const localapi = "http://localhost:9000/graph";
const API = "https://heshds.netlify.app";

const Graph = (props) => {
  const [data, setdata] = useState([]);

  useEffect(() => {
    console.log("graph");

    axios
      .get(`${API}/.netlify/functions/graph`)
      //   .get(localapi)
      .then((result) => {
        console.log(result.data.data.records);

        var temparr_rizky = [];
        var temparr_draco = [];
        var temparr_flame = [];
        var temparr_cass = [];
        var temparr_td = [];
        var temparr_casspro = [];
        // var temparr_rizkypro = [];

        result.data.data.records.reverse().forEach((element) => {
          var dates = new Date(element.fields.date).toLocaleString();

          var temp_rizky = {
            x: dates,
            y: element.fields.rizky,
          };
          temparr_rizky.push(temp_rizky);

          var temp_flame = {
            x: dates,
            y: element.fields.flame,
          };
          temparr_flame.push(temp_flame);

          var temp_cass = {
            x: dates,
            y: element.fields.cass,
          };
          temparr_cass.push(temp_cass);

          var temp_draco = {
            x: dates,
            y: element.fields.draco,
          };
          temparr_draco.push(temp_draco);

          var temp_td = {
            x: dates,
            y: element.fields.td,
          };
          temparr_td.push(temp_td);

          var temp_casspro = {
            x: dates,
            y: element.fields.casspro,
          };
          temparr_casspro.push(temp_casspro);

          // var temp_rizkypro = {
          //   x: dates,
          //   y: element.fields.rizkypro,
          // };
          // temparr_rizkypro.push(temp_rizkypro);
        });

        console.log(temparr_rizky);

        setdata([
          {
            id: "rizkt",
            color: "hsl(253, 70%, 50%)",
            data: temparr_rizky,
          },
          {
            id: "falme",
            color: "hsl(253, 70%, 50%)",
            data: temparr_flame,
          },
          {
            id: "cass",
            color: "hsl(253, 70%, 50%)",
            data: temparr_cass,
          },
          {
            id: "draco",
            color: "hsl(253, 70%, 50%)",
            data: temparr_draco,
          },
          {
            id: "td",
            color: "hsl(253, 70%, 50%)",
            data: temparr_td,
          },
          {
            id: "casspro",
            color: "hsl(253, 70%, 50%)",
            data: temparr_casspro,
          },
          // {
          //   id: "rizkypro",
          //   color: "hsl(253, 70%, 50%)",
          //   data: temparr_rizkypro,
          // },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div id="graphdiv" className="container chartdiv">
      <App data={data} linecolor="#ff4000" legendName={"MMR"} />
    </div>
  );
};

export default Graph;
