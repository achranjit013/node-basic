import express from "express";
import path from "path";
import fs from "fs";

const app = express();

const PORT = 8000;

const __dirname = path.resolve();
const fn = __dirname + "/userList.csv";

// API endpoints
app.get("/ranjit", (req, res) => {
  const obj = {
    message: "server is api",
  };
  res.json(obj);
});

app.use(express.urlencoded());

// for registraion
app.get("/registration", (req, res) => {
  console.log("registration", req.query);
  res.sendFile(__dirname + "/register.html");
});

app.post("/registration", (req, res) => {
  console.log("registration", req.body);
  const { email, password } = req.body;

  const str = email + "|" + password + "\n";
  // store in csv file
  fs.appendFile(fn, str, (err) => {
    err ? console.log(err) : console.log("data has been written in the file");
  });

  res.send(`<h1>Thank you!</h1><a href="/">Home</a>`);
});

// for login
app.get("/login", (req, res) => {
  console.log("login", req.query);
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const str = email + "|" + password;

  fs.readFile(fn, (error, data) => {
    if (error) {
      return res.send(error.message);
    }
    const users = data.toString();

    users.includes(str)
      ? res.send(`<h1>You are logged in!</h1> <a href="/">Home</a>`)
      : res.send(`invalid login <a href="/login">Login</a>`);
  });
});

app.use("/", (req, res) => {
  res.send(`<a href="/registration">Registration</a>
  <a href="/login">Login</a>`);
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log("your server is running at http://localhost:" + PORT);
});
