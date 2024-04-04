const express = require('express');
const session = require("express-session");
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 8080;

// Session middleware
app.use(session({
    secret: "your_secret_here", // Fixed session secret
    resave: false,
    saveUninitialized: true
}));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection URL
const url = "mongodb+srv://rishabhpsingh11:wA8vLcunw8hdEjbH@cluster0.x38enuw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Route to serve registration form
app.get('/register', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Route for login
app.post('/login_submit', async (req, res) => {
    console.log("Login Request -");
    console.log(req.body.email);
    console.log(req.body.password);
    
    try {
        const client = await MongoClient.connect(url);
        const dbo = client.db("mydb");
        const result = await dbo.collection("Data").findOne({ "email": req.body.email });
        
        if (result && result.password === req.body.password) {
            res.sendFile(__dirname + "/home.html");
        } else {
            res.send("Login Not Successful...!");
        }
        
        client.close();
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Route for registration
app.post('/register_submit', async (req, res) => {
    console.log("Registration API called-");
    console.log(req.body.text);
    console.log(req.body.email);
    console.log(req.body.password);
    
    try {
        const client = await MongoClient.connect(url);
        const dbo = client.db("mydb");
        await dbo.collection("Data").insertOne({
            name: req.body.text,
            email: req.body.email,
            password: req.body.password
        });
        
        console.log("User registered!!!");
        console.log("User Registered with email " + req.body.email);
        console.log("---------------------------------------------");
        
        client.close();
        res.sendFile(__dirname + "/index.html");
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).send("Registration failed");
    }
});

// Route for contact form
app.post('/contact_submit', async (req, res) => {
    console.log("Contact us form API called-");
    console.log(req.body.email);
    console.log(req.body.name);
    console.log(req.body.textarea);
    
    try {
        const client = await MongoClient.connect(url);
        const dbo = client.db("mydb");
        await dbo.collection("CONTACT").insertOne({
            email: req.body.email,
            name: req.body.name,
            textarea: req.body.textarea
        });
        
        console.log("User Contact us Request Received with email " + req.body.email);
        console.log("---------------------------------------------");
        
        client.close();
        res.sendFile(__dirname + "/contactus.html");
    } catch (err) {
        console.error("Error during contact form submission:", err);
        res.status(500).send("Contact form submission failed");
    }
});

// Route for logout
app.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.error("Error during logout:", err);
            res.status(500).send("Logout failed");
        } else {
            console.log("Logout successful");
            res.send("Logout successful");
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log("Running on http://localhost:8080");
});
