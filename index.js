const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const request = require('request');
const GitHub = require('github-api');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const API_SECRET = 'tdy@FqUdMhy9LMn';

//app.get("/", (req, res) => res.send("Hello World!"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())


app.post('/', (req, res) => {
    const payload = req.body;
    const user = 'GitHubOrg-Soumya';
    const cred = process.env['GH_TOKEN'];
    try {
        if (payload["action"] == 'created') {
            console.log("Repo created");
            let options = {
                url: payload["repository"]["url"] + "/branches/master/protection",
                headers: {
                    Authorization:`Bearer ${cred}`,
                    'User-Agent': 'kancharlasoumya'
                }
            };

         /*   const post_options = {
                Authorization:`Bearer ${cred}`,
                "required_status_checks": {"strict": 'True', "contexts": ["default"]},
                "User-Agent": 'TestRepo',
                "enforce_admins": 'False',
                "required_pull_request_reviews": 'None',
                "restrictions": 'None',
            };*/
            //const Url = payload["repository"]["url"] + "/branches/master/protection";
            //Create Branch Protection for the master branch of the repo.
            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    let info = JSON.parse(body);
                    console.log('Branch protection created successfully. Status code:' + response.statusCode);
                    console.log(info);
                }
                else{
                    console.log("- Response "+ response.statusCode + "- Data"+ response.body);
                }
            }
            request(options, callback);

        }
    } catch (error) {
        console.log("Ignore Post Payload since it is not a create action");
    }


    if (payload["action"] == 'deleted') {
        console.log("Repo deleted");
    }
    res.sendStatus(200);
});


app.listen(3000, () => console.log("Server listening on port 3000!"));

