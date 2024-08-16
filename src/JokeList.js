import React, { useState, useEffect } from "react";
import Joke from "./Joke";
import axios from "axios";
import "./JokeList.css";

const JokeList = () => {
  const [jokes, setJokes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedJokes = JSON.parse(localStorage.getItem("jokes"));
    if (savedJokes) {
      setJokes(savedJokes);
      setLoading(false);
    } else {
      fetchJokes();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("jokes", JSON.stringify(jokes));
  }, [jokes]);

  const fetchJokes = async () => {
    setLoading(true);
    let newJokes = [];
    let seenJokes = new Set(jokes.filter(j => j.locked).map(j => j.id));

    try {
      while (newJokes.length < 5 - jokes.filter(j => j.locked).length) {
        let res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" }
        });
        let { id, joke } = res.data;

        if (!seenJokes.has(id)) {
          seenJokes.add(id);
          newJokes.push({ id, text: joke, votes: 0, locked: false });
        }
      }
      setJokes([...jokes.filter(j => j.locked), ...newJokes]);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const vote = (id, delta) => {
    setJokes(jokes =>
      jokes.map(j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    );
  };

  const resetVotes = () => {
    setJokes([]);
    localStorage.removeItem("jokes");
  };

  const toggleLock = (id) => {
    setJokes(jokes =>
      jokes.map(j =>
        j.id === id ? { ...j, locked: !j.locked } : j
      )
    );
  };

  if (loading) {
    return <div className="JokeList-spinner">Loading...</div>;
  }

  return (
    <div className="JokeList">
      <button onClick={fetchJokes} className="JokeList-getmore">Fetch New Jokes</button>
      <button onClick={resetVotes} className="JokeList-getmore">Reset Votes</button>
      {jokes.map(j => (
        <Joke key={j.id} id={j.id} votes={j.votes} text={j.text} vote={vote} toggleLock={toggleLock} locked={j.locked} />
      ))}
    </div>
  );
};

export default JokeList;
