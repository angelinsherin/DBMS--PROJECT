const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// DB Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'online_exam'
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...");
});


// 👉 Register User
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    db.query(
        "INSERT INTO users (name,email,password,role) VALUES (?,?,?,'student')",
        [name, email, password],
        (err, result) => {
            if (err) return res.send(err);
            res.send("User Registered");
        }
    );
});

// 👉 Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query(
        "SELECT * FROM users WHERE email=? AND password=?",
        [email, password],
        (err, result) => {
            if (err) return res.send(err);
            res.send(result);
        }
    );
});

// 👉 Get Exams
app.get('/exams', (req, res) => {
    db.query("SELECT * FROM exams", (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

// 👉 Get Questions
app.get('/questions/:exam_id', (req, res) => {
    const exam_id = req.params.exam_id;

    db.query(
        "SELECT * FROM questions WHERE exam_id=?",
        [exam_id],
        (err, questions) => {
            if (err) return res.send(err);

            db.query(
                "SELECT * FROM options",
                (err, options) => {
                    if (err) return res.send(err);

                    res.send({ questions, options });
                }
            );
        }
    );
});

// 👉 Submit Result
app.post('/submit', (req, res) => {
    const { user_id, exam_id, score } = req.body;

    db.query(
        "INSERT INTO results (user_id, exam_id, score) VALUES (?,?,?)",
        [user_id, exam_id, score],
        (err, result) => {
            if (err) return res.send(err);
            res.send("Result Saved");
        }
    );
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
