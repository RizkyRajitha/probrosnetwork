import fetch from "node-fetch";
const redis = require("redis");

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

const { REDISHOST, REDISPORT, REDISPASSWORD } = process.env;

const RedisClient = redis.createClient({
  host: REDISHOST || require("../../config/env").redishost,
  port: REDISPORT || require("../../config/env").redisport,
  password: REDISPASSWORD || require("../../config/env").redispass,
});

RedisClient.on("error", (err) => {
  console.log("Error " + err);
});

RedisClient.on("connect", (err) => {
  console.log("Connected to redis ☄" + err);
});

let respormise = new Promise((resolve, reject) => {
  const photosRedisKey = "data:Dota";
  RedisClient.get(photosRedisKey, (err, data) => {
    // console.log(err, data);
    if (!err) {
      if (data) {
        resolve({
          statusCode: 200,
          body: JSON.stringify({ source: "CACHE", data: JSON.parse(data) }),
        });
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
            resolve({
              statusCode: 200,
              body: JSON.stringify({ source: "OPEN DOTA API", data: result }),
            });
          })
          .catch((err) => {
            console.log(err);
            reject({ statusCode: 500, body: String(err) });
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

exports.handler = async (event, context) => {
  const resu = await respormise;
  console.log(resu);
  return resu;

  // console.log(res);
};

// const fetch = require("node-fetch");
// const redis = require("redis");
// // require('../../')
// const RedisClient = redis.createClient({
//   host: require("../../config/env").redishost,
//   port: require("../../config/env").redisport,
//   password: require("../../config/env").redispass,
// });

// RedisClient.on("error", (err) => {
//   console.log("Error " + err);
// });

// RedisClient.on("connect", (err) => {
//   console.log("Connected to redis ☄" + err);
// });

// const API = "https://api.opendota.com/api";
// const PLAYERS = [
//   "264853364",
//   "167596568",
//   "326010968",
//   "140732052",
//   "188126754",
//   "172508840", //heshan
//   "210855099",
// ];

// // app.get("/data", (req, res) => {});
// const API_ENDPOINT = "https://icanhazdadjoke.com/";

// exports.handler = async (event, context) => {
//   return fetch(API_ENDPOINT, { headers: { "Accept": "application/json" } })
//     .then(response => response.json())
//     .then(data => ({
//       statusCode: 200,
//       body: data.joke
//     }))
//     .catch(error => ({ statusCode: 422, body: String(error) }));
// };

// exports.handler = function (event, context, callback) {
//   // const photosRedisKey = "data:Dota";

//   fetch(API_ENDPOINT, { headers: { Accept: "application/json" } })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data.joke);
//       callback({
//         statusCode: 200,
//         body: data.joke,
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//       callback({ statusCode: 422, body: String(error) });
//     });

// RedisClient.get(photosRedisKey, (err, data) => {
//   if (!err) {
//     if (data) {
//       callback(null, {
//         statusCode: 200,
//         body: JSON.stringify({ source: "CACHE", data: JSON.parse(data) }),
//       });

//       // res.status(200).json({ source: "CACHE", data: JSON.parse(data) });
//     } else {
//       const Data = [];

//       var promisearr = PLAYERS.map((element) => {
//         return new Promise((resolve, reject) => {
//           fetch(`${API}/players/${element}`)
//             .then((response) => response.json())
//             .then((profiledata) => {
//               fetch(`${API}/players/${element}/wl`)
//                 .then((response) => response.json())
//                 .then((winlossdata) => {
//                   // console.log(profiledata.data);
//                   // console.log(winlossdata.data);

//                   var tempdata = {
//                     ...profiledata,
//                     ...winlossdata,
//                   };

//                   resolve(tempdata);

//                   console.log(tempdata);
//                   // var ne = [...data, tempdata];
//                   // setdata(ne);
//                   Data.push(tempdata);
//                   // setdata((pre) => {
//                   //   return [...pre, tempdata];
//                   // });
//                 })
//                 .catch((err) => {
//                   console.log(err);
//                   reject(err);
//                 });
//             })
//             .catch((err) => {
//               console.log(err);
//               reject(err);
//             });
//         });
//       });

//       console.log("good stuff");
//       console.log(Data);

//       Promise.all(promisearr)
//         .then((result) => {
//           console.log(result);
//           RedisClient.setex(photosRedisKey, 3600, JSON.stringify(result));

//           callback(null, {
//             statusCode: 200,
//             body: JSON.stringify({ source: "OPEN DOTA API", data: result }),
//           });

//           // return res
//           //   .status(200)
//           //   .json({ source: "OPEN DOTA API", data: result });
//         })
//         .catch((err) => {
//           console.log(err);
//           callback(null, {
//             statusCode: 500,
//             body: JSON.stringify({ err: err }),
//           });
//           // return res.status(500).json(err);
//         });

//       // if (Data) {
//       //   return res.json({ source: "api", data: Data });
//       // }

//       //   client.setex(photosRedisKey, 3600, JSON.stringify(photos));

//       // Send JSON response to client
//     }
//   }
// });
// };
