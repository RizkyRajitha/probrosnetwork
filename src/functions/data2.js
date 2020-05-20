import fetch from "node-fetch";
const redis = require("redis");
const { REDISHOST, REDISPORT, REDISPASSWORD } = process.env;
const AIRTABLEAPIKEY =
  process.env.AIRTABLEAPIKEY || require("../../config/env").AIRTABLEAPIKEY;
const AIRTABLEBASEID =
  process.env.AIRTABLEBASEID || require("../../config/env").AIRTABLEBASEID;
const AIRTABLETABLENAME =
  process.env.AIRTABLETABLENAME ||
  require("../../config/env").AIRTABLETABLENAME;

// console.log(REDISHOST, REDISPORT, AIRTABLEBASEID);

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

const PLAYERSWNAME = [
  { id: "264853364", name: "flame" },
  { id: "167596568", name: "cass" },
  { id: "326010968", name: "casspro" },
  { id: "140732052", name: "rizky" },
  { id: "188126754", name: "td" },
  { id: "172508840", name: "draco" }, //heshan
  { id: "210855099", name: "rizkypro" },
];

let RedisClient = null;

let respormise = (RedisClient2) => {
  return new Promise((resolve, reject) => {
    const photosRedisKey = "data:Dota";
    RedisClient2.get(photosRedisKey, (err, data) => {
      // console.log(err, data);
      if (!err) {
        if (!data) {
          resolve({
            statusCode: 200,
            body: JSON.stringify({ source: "CACHE", data: JSON.parse(data) }),
          });
        } else {
          var promisearr = PLAYERS.map((element) => {
            return new Promise((resolve, reject) => {
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

                      resolve(tempdata);
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

          Promise.all(promisearr)
            .then((result) => {
              console.log(result);
              RedisClient2.setex(photosRedisKey, 3600, JSON.stringify(result));

              result.forEach((element) => {
                console.log(element.profile.account_id);
              });

              // resolve({
              //   statusCode: 200,
              //   body: JSON.stringify({ source: "OPEN DOTA API", data: result }),
              // });

              var datain = {
                date: new Date().toString(),
                flame: null,
                cass: null,
                casspro: null,
                rizky: null,
                td: null,
                draco: null,
                rizkypro: null,
              };

              result.forEach((element) => {
                PLAYERSWNAME.forEach((element2) => {
                  if (element.profile.account_id === parseInt(element2.id)) {
                    var name = PLAYERSWNAME.filter((ele) =>
                      ele.id === element2.id ? true : false
                    );

                    console.log(name);

                    switch (name[0].name) {
                      case "rizky":
                        datain.rizky = String(element.mmr_estimate.estimate);
                        break;
                      case "draco":
                        datain.draco = String(element.mmr_estimate.estimate);
                        break;
                      case "flame":
                        datain.flame = String(element.mmr_estimate.estimate);
                        break;
                      case "td":
                        datain.td = String(element.mmr_estimate.estimate);
                        break;
                      case "rizkypro":
                        datain.rizkypro = String(element.mmr_estimate.estimate);
                        break;
                      case "cass":
                        datain.cass = String(element.mmr_estimate.estimate);
                        break;
                      case "casspro":
                        datain.casspro = String(element.mmr_estimate.estimate);
                        break;
                      default:
                        break;
                    }

                    console.log(datain);
                  }
                });
              });

              var payload = {
                records: [
                  {
                    fields: datain,
                  },
                ],
              };

              console.log(payload);

              fetch(
                `https://api.airtable.com/v0/${AIRTABLEBASEID}/${AIRTABLETABLENAME}`,
                {
                  method: "post",
                  body: JSON.stringify(payload),
                  headers: {
                    Authorization: `Bearer ${AIRTABLEAPIKEY}`,
                    "Content-Type": "application/json",
                  },
                }
              )
                .then((res) => res.json())
                .then((resultfmairtable) => {
                  console.log(resultfmairtable);
                  resolve({
                    statusCode: 200,
                    body: JSON.stringify({
                      source: "OPEN DOTA API",
                      data: result,
                      graph: resultfmairtable,
                    }),
                  });
                })
                .catch((err) => {
                  console.log(err);
                  reject({ statusCode: 500, body: String(err) });
                });

              // to create a record we need to send a "POST" request with our base id, table name, our API key, and send a body with the new data we wish to add.
            })
            .catch((err) => {
              console.log(err);
              reject({ statusCode: 500, body: String(err) });
            });
        }
      } else {
        var promisearr2 = PLAYERS.map((element) => {
          return new Promise((resolve, reject) => {
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

                    resolve(tempdata);
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

        Promise.all(promisearr2)
          .then((result) => {
            console.log(result);
            RedisClient2.setex(photosRedisKey, 3600, JSON.stringify(result));

            result.forEach((element) => {
              console.log(element.profile.account_id);
            });

            resolve({
              statusCode: 200,
              body: JSON.stringify({ source: "CACHE FAILED", data: result }),
            });

            // var datain = {
            //   date: new Date().toString(),
            //   flame: null,
            //   cass: null,
            //   casspro: null,
            //   rizky: null,
            //   td: null,
            //   draco: null,
            //   rizkypro: null,
            // };

            // result.forEach((element) => {
            //   // console.log(element.profile.account_id);
            //   // console.log(element.mmr_estimate.estimate);

            //   PLAYERSWNAME.forEach((element2) => {
            //     if (element.profile.account_id === parseInt(element2.id)) {
            //       // console.log(element.profile.account_id);

            //       var name = PLAYERSWNAME.filter((ele) =>
            //         ele.id === element2.id ? true : false
            //       );

            //       console.log(name);

            //       switch (name[0].name) {
            //         case "rizky":
            //           datain.rizky = String(element.mmr_estimate.estimate);
            //           break;
            //         case "draco":
            //           datain.draco = String(element.mmr_estimate.estimate);
            //           break;
            //         case "flame":
            //           datain.flame = String(element.mmr_estimate.estimate);
            //           break;
            //         case "td":
            //           datain.td = String(element.mmr_estimate.estimate);
            //           break;
            //         case "rizkypro":
            //           datain.rizkypro = String(element.mmr_estimate.estimate);
            //           break;
            //         case "cass":
            //           datain.cass = String(element.mmr_estimate.estimate);
            //           break;
            //         case "casspro":
            //           datain.casspro = String(element.mmr_estimate.estimate);
            //           break;
            //         default:
            //           break;
            //       }

            //       console.log(datain);
            //     }
            //   });
            // });

            // var payload = {
            //   records: [
            //     {
            //       fields: datain,
            //     },
            //   ],
            // };

            // console.log(payload);

            // fetch(
            //   `https://api.airtable.com/v0/${AIRTABLEBASEID}/${AIRTABLETABLENAME}`,
            //   {
            //     method: "post",
            //     body: JSON.stringify(payload),
            //     headers: {
            //       Authorization: `Bearer ${AIRTABLEAPIKEY}`,
            //       "Content-Type": "application/json",
            //     },
            //   }
            // )
            //   .then((res) => res.json())
            //   .then((result) => {
            //     console.log(result);
            //     //send results to the client
            //     // res.json(result);
            //   })
            //   .catch((err) => {
            //     console.log(err);
            //   });

            // to create a record we need to send a "POST" request with our base id, table name, our API key, and send a body with the new data we wish to add.
          })
          .catch((err) => {
            console.log(err);
            reject({ statusCode: 500, body: String(err) });
          });
      }
    });
  });
};

exports.handler = async (event, context) => {
  if (!RedisClient) {
    RedisClient = redis.createClient({
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

    const resu = await respormise(RedisClient);
    // console.log(resu);
    return resu;
  } else {
    RedisClient.on("error", (err) => {
      console.log("Error " + err);
    });

    RedisClient.on("connect", (err) => {
      console.log("Connected to redis ☄" + err);
    });

    const resu = await respormise(RedisClient);
    // console.log(resu);
    return resu;
  }
};
