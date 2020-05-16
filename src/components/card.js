import React from "react";
import "./card.css";
const Card = (props) => {
  // console.log(props);
  return (
    <div className=" card profilecard">
      <div className="card-image">
        <img
          alt={`${props.avatarurl}'s avatar`}
          src={props.avatarurl}
          className="img-responsive"
        />
      </div>

      <div className="card-header">
        <img
          alt={`${props.countrycode} flag`}
          src={`https://www.countryflags.io/${props.countrycode}/flat/64.png`}
          className="img-responsive"
        />

        <div className="card-title h5">{props.username}</div>
        <div className="card-subtitle ">Estimate MMR : {props.mmr}</div>
        <div className="card-subtitle ">
          DotaPlus {props.dotaplus ? "🟢" : "🔴"}
        </div>
        <div className="card-subtitle ">Wins : {props.wins}</div>
        <div className="card-subtitle ">Loses : {props.loses}</div>
        <div className="card-subtitle ">
          Wins - Losses : {props.wins - props.loses}
        </div>
        <div className="card-subtitle ">
          Wins percentage :{" "}
          {Math.round((props.wins / (props.wins + props.loses)) * 100)}%
        </div>
      </div>

      <div className="card-footer">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={props.profileurl}
          className="btn btn-primary"
        >
          Profile
        </a>
      </div>
    </div>
  );
};
export default Card;

/*
Actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy"
Awards: "Won 4 Oscars. Another 152 wins & 217 nominations."
BoxOffice: "$292,568,851"
Country: "USA, UK"
DVD: "07 Dec 2010"
Director: "Christopher Nolan"
Genre: "Action, Adventure, Sci-Fi, Thriller"
Language: "English, Japanese, French"
Metascore: "74"
Plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg"
Production: "Warner Bros. Pictures"
Rated: "PG-13"
Ratings: (3) [{…}, {…}, {…}]
Released: "16 Jul 2010"
Response: "True"
Runtime: "148 min"
Title: "Inception"
Type: "movie"
Website: "N/A"
Writer: "Christopher Nolan"
Year: "2010"
imdbID: "tt1375666"
imdbRating: "8.8"
imdbVotes: "1,934,808"
*/
