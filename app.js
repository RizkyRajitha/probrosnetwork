const express = require("express");
const app = express();
const cors = require("cors");
const bp = require("body-parser");
const fetch = require("node-fetch");
const redis = require("redis");

app.use(cors());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(require("morgan")("dev"));

const RedisClient = redis.createClient({
  host: require("./client/config/env").redishost,
  port: require("./client/config/env").redisport,
  password: require("./client/config/env").redispass,
});

const port = process.env.PORT || 5000;
const API = "https://api.opendota.com/api";
const PLAYERS = [
  "264853364",
  "167596568",
  "326010968",
  "140732052",
  "188126754",
  "172508840", //heshan
  "210855099",
];

app.get("/data", (req, res) => {
  const photosRedisKey = "data:Dota";

  return RedisClient.get(photosRedisKey, (err, data) => {
    if (!err) {
      if (data) {
        return res
          .status(200)
          .json({ source: "CACHE", data: JSON.parse(data) });
      } else {
        const Data = [];

        var promisearr = PLAYERS.map((element) => {
          return new Promise((resolve, reject) => {
            fetch(`${API}/players/${element}`)
              .then((response) => response.json())
              .then((profiledata) => {
                fetch(`${API}/players/${element}/wl`)
                  .then((response) => response.json())
                  .then((winlossdata) => {
                    // console.log(profiledata.data);
                    // console.log(winlossdata.data);

                    var tempdata = {
                      ...profiledata,
                      ...winlossdata,
                    };

                    resolve(tempdata);

                    console.log(tempdata);
                    // var ne = [...data, tempdata];
                    // setdata(ne);
                    Data.push(tempdata);
                    // setdata((pre) => {
                    //   return [...pre, tempdata];
                    // });
                  })
                  .catch((err) => {
                    console.log(err);
                    reject(err);
                  });
              })
              .catch((err) => {
                console.log(err);
                reject(err);
              });
          });
        });

        console.log("good stuff");
        console.log(Data);

        Promise.all(promisearr)
          .then((result) => {
            console.log(result);
            RedisClient.setex(photosRedisKey, 3600, JSON.stringify(result));
            return res
              .status(200)
              .json({ source: "OPEN DOTA API", data: result });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
          });

        // if (Data) {
        //   return res.json({ source: "api", data: Data });
        // }

        //   client.setex(photosRedisKey, 3600, JSON.stringify(photos));

        // Send JSON response to client
      }
    }
  });
});

app.get("/oneplayer/:id", (req, res) => {
  console.log(req.params.id);
  var element = req.params.id;

  fetch(`${API}/players/${element}`)
    .then((response) => response.json())
    .then((profiledata) => {
      fetch(`${API}/players/${element}/wl`)
        .then((response) => response.json())
        .then((winlossdata) => {
          var tempdata = {
            ...profiledata,
            ...winlossdata,
          };

          console.log(tempdata);

          res.status(200).json(tempdata);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// app.get("/demo", (req, res) => {
//   const demokey = "123";

//   return RedisClient.get(demokey, (err, data) => {
//     console.log(err, data);
//     if (!err) {
//       if (data) {
//         console.log("cache kicks in");
//         return res.status(200).json({ source: "cache", data: data });
//       } else {
//         // console.log(Data);
//         RedisClient.setex(demokey, 3600, "llllllllloooooooooollllllllllll");

//         // Send JSON response to client
//         console.log("fetced from api");
//         return res.json({
//           source: "api",
//           data: "llllllllloooooooooollllllllllll",
//         });
//       }
//     }
//   });
// });

RedisClient.on("error", (err) => {
  console.log("Error " + err);
});

RedisClient.on("connect", (err) => {
  console.log("Connected to redis ☄" + err);
});

app.listen(port, () => {
  console.log("listning on " + port);
});
