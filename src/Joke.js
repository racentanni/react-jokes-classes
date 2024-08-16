import React from "react";
import "./Joke.css";

/** A single joke, along with vote up/down buttons. */

const Joke = ({ id, vote, votes, text, toggleLock, locked }) => {
  return (
    <div className="Joke">
      <div className="Joke-votearea">
        <button onClick={() => vote(id, +1)}>
          <i className="fas fa-thumbs-up" />
        </button>

        <button onClick={() => vote(id, -1)}>
          <i className="fas fa-thumbs-down" />
        </button>

        {votes}
      </div>

      <div className="Joke-text">{text}</div>

      <button onClick={() => toggleLock(id)} className="Joke-lock">
        {locked ? "Unlock" : "Lock"}
      </button>
    </div>
  );
};

export default Joke;
