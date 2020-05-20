import fetch from "node-fetch";

const AIRTABLEAPIKEY =
  process.env.AIRTABLEAPIKEY || require("../../config/env").AIRTABLEAPIKEY;
const AIRTABLEBASEID =
  process.env.AIRTABLEBASEID || require("../../config/env").AIRTABLEBASEID;
const AIRTABLETABLENAME =
  process.env.AIRTABLETABLENAME ||
  require("../../config/env").AIRTABLETABLENAME;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
};

let respormise = new Promise((resolve, reject) => {
  fetch(
    `https://api.airtable.com/v0/${AIRTABLEBASEID}/${AIRTABLETABLENAME}?view=Grid%20view&filterByFormula=NOT({date} = '')`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLEAPIKEY}`,
      },
    }
  )
    .then((res) => res.json())
    .then((result) => {
      console.log(result);

      resolve({
        statusCode: 200,
        headers,
        body: JSON.stringify({ data: result }),
      });
    })
    .catch((err) => {
      console.log(err);

      reject({ statusCode: 500, headers, body: JSON.stringify(err) });
    });
});

exports.handler = async (event, context) => {
  const resu = await respormise;
  console.log(resu);
  return resu;
};
