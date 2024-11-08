require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const he = require("he");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const session = require("express-session");
const { MongoClient } = require("mongodb");

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "http://localhost:5001",
    credentials: true,
  }),
);

app.use(express.json());
app.use(
  session({
    secret: process.env.SECRETKEY,
    cookie: { maxAge: 3600000 },
    saveUnitialized: false,
    resave: false,
  }),
);

let token;

// Obtain api token
async function getToken() {
  try {
    const tokenResponse = await axios.get(
      "https://opentdb.com/api_token.php?command=request",
    ); // obtain session key
    let token = tokenResponse.data.token;

    return token;
  } catch (e) {
    console.error(e);
  }
}

/**
 * Obtain data and decode the default html encoding using 'he' dependency; return as json
 *
 * @param {*} num is the number of questions wanted to be answered
 * @param {*} token is the session token needed for this api call
 * @returns
 */
async function generateTrivia(num, token, difficulty) {
  const response = await axios.get(
    `https://opentdb.com/api.php?amount=${num}&category=22&difficulty=${difficulty}&type=multiple&token=${token}`,
  );
  const data = response.data.results;

  const triviaData = data.map((question) => ({
    question: he.decode(question.question),
    difficulty: he.decode(question.difficulty),
    correct_answer: he.decode(question.correct_answer),
    incorrect_answers: question.incorrect_answers.map((answer) =>
      he.decode(answer),
    ),
  }));

  return triviaData;
}

/**
 *
 *
 * @param {*} question
 * @param {*} correctAnswer
 * @param {*} incorrect
 * @returns
 */
async function generateHint(question, correctAnswer, incorrect) {
  let prompt =
    "Can you generate a hint for this question: " +
    question +
    ", with the answer being: " +
    correctAnswer +
    " and the wrong answers being: " +
    incorrect.join(", ");

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    prompt: prompt,
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Fetches documents within the mongodb database to display as leaderboard -- not reliant on session
 * @returns data of mongoDB database
 */
async function getLeaderboard() {
  let mongoClient;
  try {
    mongoClient = new MongoClient(process.env.URI);
    await mongoClient.connect();
    const db = mongoClient.db("triviagame");
    const collection = db.collection("leaderboard");

    // Fetch leaderboard data sorted by score in descending order
    const data = await collection.find({}).sort({ score: -1 }).toArray();

    return data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  } finally {
    if (mongoClient) {
      await mongoClient.close(); // Properly close the connection
    }
  }
}

/**
 * Posts documents within the mongodb database to display as leaderboard -- reliant on session
 * @returns data of mongoDB database
 */
async function postLeaderboard(playerName, score) {
  let mongoClient;
  try {
    mongoClient = new MongoClient(process.env.URI);
    await mongoClient.connect();
    const db = mongoClient.db("triviagame");
    const collection = db.collection("leaderboard");

    await collection.insertOne({ name: playerName, score: score });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  } finally {
    if (mongoClient) {
      await mongoClient.close(); // Properly close the connection
    }
  }
}

/**
 * Handle api requests for question data here
 */
app.get("/question", async (req, res) => {
  try {
    token = await getToken(); // Generate unique token for the API call, not the session
    let num = req.session.numQuestion; // We make this variable whatever was passed in via another post method
    let difficulty = req.session.difficulty;

    const questionData = await generateTrivia(num, token, difficulty);

    // Instantiate all of these important game logic session variables
    req.session.questions = questionData;
    req.session.currentQuestion = 0;
    req.session.score = 0;
    req.session.numCorrect = 0;
    req.session.hintsLeft = 5;
    req.session.streak = 0;

    res.status(200).json({ questionData });
  } catch (e) {
    console.error(e);
  }
});

/**
 * Gemini AI api generated hints passing in session variables into the prompt
 */
app.get("/hint", async (req, res) => {
  try {
    const questionIndex = parseInt(req.query.questionIndex, 10);

    // Check if the session has hintsLeft and questions stored
    if (req.session.hintsLeft > 0) {
      const question = req.session.questions[questionIndex].question;
      const correct = req.session.questions[questionIndex].correct_answer;
      const incorrect = req.session.questions[questionIndex].incorrect_answers;

      const hint = await generateHint(question, correct, incorrect);

      req.session.hintsLeft -= 1;

      res.status(200).json({ hint, hintsLeft: req.session.hintsLeft });
    } else {
      res.status(400).json({ message: "Hints exhausted" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Fetch leaderboard data to display in frontend
 */
app.get("/leaderboard", async (req, res) => {
  try {
    leaderboardData = await getLeaderboard();
    res.status(200).json(leaderboardData);
  } catch (e) {
    console.error(e);
  }
});

/**
 * Obtain difficulty for state-related functions
 */
app.get("/getdifficulty", async (req, res) => {
  try {
    // Return the difficulty from the session or any other source
    res.status(200).json({ difficulty: req.session.difficulty });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Function to determine the levels that the user has gone through and acquired to their session.
 */
app.get("/getcompleted", async (req, res) => {
  try {
    res
      .status(200)
      .json({ completedDifficulties: req.session.completedDifficulties || [] });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/answer", async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;
    let question = req.session.questions[questionIndex];
    let streak = req.session.streak;

    if (!question) {
      return res.status(400).json({ error: "Invalid question index" });
    }

    // Compare value of session to passed in answer
    const isCorrect = question.correct_answer === answer;

    // update session streak because const is created when this endpoint is called
    if (isCorrect) {
      req.session.streak += 1;
      if (req.session.difficulty == "easy") {
        req.session.score += 100 * req.session.streak;
      } else if (req.session.difficulty == "medium") {
        req.session.score += 200 * req.session.streak;
      } else {
        req.session.score += 300 * req.session.streak;
      }
      req.session.numCorrect += 1;
    } else if (!isCorrect && streak != 0) {
      req.session.streak = 0;
    }

    // update which question the user is on
    req.session.currentQuestion += 1;

    // Send response and ensure no further actions happen afterward
    return res
      .status(200)
      .json({
        isCorrect,
        score: req.session.score,
        streak: req.session.streak,
        numCorrect: req.session.numCorrect,
      });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Sets the number of questions and the associated difficulty: easy, medium, or difficult.
 *
 */
app.post("/setgame", async (req, res) => {
  try {
    const { numQuestion, difficulty } = req.body;

    req.session.numQuestion = numQuestion;
    req.session.difficulty = difficulty;

    res
      .status(200)
      .json({
        numQuestion: req.session.numQuestion,
        difficulty: req.session.difficulty,
      });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Sets the number of questions that the user wants to answer and the associated difficulty: easy, medium, or difficult.
 *
 */
app.post("/setblitz", async (req, res) => {
  try {
    const { numQuestion, difficulty } = req.body;

    req.session.numQuestion = numQuestion; // let's hard code this to 50
    req.session.difficulty = difficulty; // hard code this to be an empty string

    res
      .status(200)
      .json({
        numQuestion: req.session.numQuestion,
        difficulty: req.session.difficulty,
      });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Adjust the acquired levels everytime a difficulty is completed
 */
app.post("/setcompleted", async (req, res) => {
  try {
    const { difficulty } = req.body;

    if (!req.session.completedDifficulties) {
      req.session.completedDifficulties = [];
    }

    if (!req.session.completedDifficulties.includes(difficulty)) {
      req.session.completedDifficulties.push(difficulty);
    }

    res
      .status(200)
      .json({ completedDifficulties: req.session.completedDifficulties });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Pushing data to the database
 */
app.post("/postleaderboard", async (req, res) => {
  try {
    const { userName, score } = req.body;
    postLeaderboard(userName, score);

    res.status(200).json("Leaderboard updated");
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Connecting with database gone wrong." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
