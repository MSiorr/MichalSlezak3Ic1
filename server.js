var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

var users = [
    { id: 1, log: "AAA", pass: "AAA", wiek: 10, uczen: "checked", plec: "m" },
    { id: 2, log: "BBB", pass: "BBB", wiek: 16, uczen: "", plec: "k" },
    { id: 3, log: "CCC", pass: "CCC", wiek: 9, uczen: "checked", plec: "m" },
    { id: 4, log: "DDD", pass: "DDD", wiek: 12, uczen: "", plec: "k" },
    { id: 5, log: "EEE", pass: "EEE", wiek: 5, uczen: "checked", plec: "m" },
];
var logged = false;
var sort = "rosnaco";

app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "pages/main.html"));
})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname, "pages/register.html"));
})

app.post("/register", function (req, res) {
    let message = "";
    let canAdd = true;

    for (let i = 0; i < users.length; i++) {
        if (req.body.login == users[i].log) {
            canAdd = false;
        }
    }
    if (canAdd == true) {
        let checkboxStatus = "checked"
        if (req.body.student != "on") {
            checkboxStatus = "";
        }
        users.push({
            id: users.length + 1, log: req.body.login, pass: req.body.password, wiek: parseInt(req.body.age), uczen: checkboxStatus, plec: req.body.plec
        })
        message = "Witaj " + req.body.login + " ! Jesteś zarejestrowany";
    } else {
        message = "Witaj! Login " + req.body.login + " jest już zajęty";
    }
    res.send(message);
})

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "pages/login.html"));
})

app.post("/login", function (req, res) {
    if (logged == true){
        res.send("Jesteś już zalogowany!")
    } else {
        for (let i = 0; i < users.length; i++) {
            if (req.body.login == users[i].log) {
                if (req.body.password == users[i].pass) {
                    logged = true;
                    res.redirect("/admin");
                }
            }
        }
        if (logged == false) {
            res.send("Błędny login lub hasło!");
        }
    }
})

app.get("/admin", function (req, res) {
    if (logged) {
        res.sendFile(path.join(__dirname, "pages/yesAdmin.html"));
    } else {
        res.sendFile(path.join(__dirname, "pages/noAdmin.html"));
    }
})

app.get("/logout", function (req, res) {
    if (logged) {
        logged = false;
        res.redirect("/");
    }
})



app.get("/sort", function (req, res) {
    if (logged == true) {
        let siteHTML = "<!DOCTYPE html><html>\
        <head><meta charset='UTF-8'><title>Show</title><link rel='stylesheet' href='/style.css'></head>\
        <body style='color:white; background:  rgb(45, 45, 45);'><div id='dynamicMenu'>\
        <a href='/sort'>sort</a><a href='/gender'>gender</a><a href='/show'>show</a></div>";

        let checkedTable = ["checked", ""];

        if (sort == "rosnaco") {
            checkedTable[0] = "checked";
            checkedTable[1] = "";
        } else if (sort == "malejaco") {
            checkedTable[0] = "";
            checkedTable[1] = "checked";
        }

        siteHTML += "<form onchange='this.submit()' id='formWithRadios' method='POST' action='/sort'>"
        siteHTML += "<input type='radio' name='sort' id='rosnaco' value='rosnaco' " + checkedTable[0] + " ><label for='rosnaco'>rosnąco</label>"
        siteHTML += "<input type='radio' name='sort' id='malejaco' value='malejaco' " + checkedTable[1] + " ><label for='malejaco'>malejąco</label>"
        siteHTML += "</form>";

        let tableUsersTemp = Array.from(users)
        tableUsersTemp.sort(function (a, b) {
            if (sort == "rosnaco") {
                return parseFloat(a.wiek) - parseFloat(b.wiek);
            } else if (sort == "malejaco") {
                return parseFloat(b.wiek) - parseFloat(a.wiek);
            }
        });

        let tableHTML = "<table class='dynamicTable'>"
        for (let i = 0; i < tableUsersTemp.length; i++) {
            tableHTML += "<tr><td>id: " + tableUsersTemp[i].id + "</td><td>user: " + tableUsersTemp[i].log + " - " + tableUsersTemp[i].pass + "</td><td>wiek: " + tableUsersTemp[i].wiek + "</td></tr>";
        }
        tableHTML += "</table>"

        siteHTML += tableHTML;
        siteHTML += "</body></html>";
        res.setHeader("Content-Type", "text/html");
        res.send(siteHTML);
    } else {
        res.sendFile(path.join(__dirname, "pages/noAdmin.html"));
    }
})

app.post("/sort", function (req, res) {
    if(logged == true){
        sort = req.body.sort
        res.redirect("/sort")
    } else {
        res.sendFile(path.join(__dirname, "pages/noAdmin.html"));
    }
})

app.get("/gender", function (req, res) {
    if (logged == true) {
        let siteHTML = "<!DOCTYPE html><html>\
        <head><meta charset='UTF-8'><title>Show</title><link rel='stylesheet' href='/style.css'></head>\
        <body style='color:white; background:  rgb(45, 45, 45);'><div id='dynamicMenu'>\
        <a href='/sort'>sort</a><a href='/gender'>gender</a><a href='/show'>show</a></div>";

        let kTable = [];
        let mTable = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].plec == "k") {
                kTable.push(i);
            } else {
                mTable.push(i);
            }
        }
        let tableHTML = "<table class='dynamicTable plecTable'>";
        for (let i = 0; i < kTable.length; i++) {
            tableHTML += "<tr><td>id: " + users[kTable[i]].id + "</td><td>płeć: " + users[kTable[i]].plec + "</td></tr>";
        }
        tableHTML += "</table>";
        tableHTML += "<table class='dynamicTable plecTable'>";
        for (let i = 0; i < mTable.length; i++) {
            tableHTML += "<tr><td>id: " + users[mTable[i]].id + "</td><td>płeć: " + users[mTable[i]].plec + "</td></tr>";
        }
        tableHTML += "</table>";

        siteHTML += tableHTML;
        siteHTML += "</body></html>";
        res.setHeader("Content-Type", "text/html");
        res.send(siteHTML);
    } else {
        res.sendFile(path.join(__dirname, "pages/noAdmin.html"));
    }
})

app.get("/show", function (req, res) {
    if (logged == true) {
        let siteHTML = "<!DOCTYPE html><html>\
        <head><meta charset='UTF-8'><title>Show</title><link rel='stylesheet' href='/style.css'></head>\
        <body style='color:white; background:  rgb(45, 45, 45);'><div id='dynamicMenu'>\
        <a href='/sort'>sort</a><a href='/gender'>gender</a><a href='/show'>show</a></div>";

        let tableHTML = "<table class='dynamicTable'>";
        for (let i = 0; i < users.length; i++) {
            tableHTML += "<tr><td>id: " + users[i].id + "</td><td>user: " + users[i].log + " - " + users[i].pass + "</td><td>uczeń: <input type='checkbox' " + users[i].uczen + " disabled></td><td>wiek: " + users[i].wiek + "</td><td>płeć: " + users[i].plec + "</td></tr>";
        }
        tableHTML += "</table>";

        siteHTML += tableHTML;
        siteHTML += "</body></html>";
        res.setHeader("Content-Type", "text/html");
        res.send(siteHTML);
    } else {
        res.sendFile(path.join(__dirname, "pages/noAdmin.html"));
    }
})

app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT);
})