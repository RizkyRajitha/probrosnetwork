import fetch from "node-fetch";
const API = "https://api.opendota.com/api";
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
};
let respormise = (id) => {
  return new Promise((resolve, reject) => {
    console.log(id);
    var element = id;

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

            resolve({
              headers: headers,
              statusCode: 200,
              body: JSON.stringify(tempdata),
            });
          })
          .catch((err) => {
            console.log(err);
            reject({
              headers: headers,
              statusCode: 500,
              body: JSON.stringify(err),
            });
          });
      })
      .catch((err) => {
        console.log(err);
        reject({
          headers: headers,
          statusCode: 500,
          body: JSON.stringify(err),
        });
      });
  });
};

exports.handler = async (event, context) => {
  console.log(event.path);
  var ids = event.path.split(":id/");
  console.log(ids);
  var id = ids[ids.length - 1];
  console.log(id);

  const resu = await respormise(id);
  console.log(resu);
  return resu;

  // console.log(res);
};
