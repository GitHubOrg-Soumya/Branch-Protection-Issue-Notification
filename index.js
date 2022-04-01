const express = require('express');
const {Octokit} = require("@octokit/core");
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

app.post('/', async (req, res) => {
    const payload = req.body;
    const cred = process.env['GH_TOKEN'];
    try {
        if (payload["action"] == 'created') {
            console.log("Repo created");
            const octokit = new Octokit({auth: cred});
            const response = await octokit.request('PUT /repos/{owner}/{repo}/branches/master/protection', {
                owner: payload["repository"]["owner"]["login"],
                repo: payload["repository"]["name"],
                required_status_checks: {
                    strict: true,
                    contexts: [
                        'contexts'
                    ],
                },
                enforce_admins: false,
                required_pull_request_reviews: null,
                restrictions: null
            });
            if (response.status == 200) {
                console.log('Branch protection created successfully. Status code:' + response.status);
                try {
                    if (payload["repository"]["has_issues"]) {
                        const responseIssue = await octokit.request('POST /repos/{owner}/{repo}/issues', {
                            owner: payload["repository"]["owner"]["login"],
                            repo: payload["repository"]["name"],
                            title: "New Protection Added",
                            body: "@"
                                + payload["repository"]["sender"]["login"]
                                + " A new branch protection was added to the master branch.",
                        });
                        if (responseIssue.status === 201) {
                            console.log('Issue created successfully. Status code:' + responseIssue.status);
                        } else {
                            console.log("Unable to create issue. Status code: ",
                                responseIssue.status + "- Data "+ responseIssue.status);
                        }
                    } else {
                        console.log("This repo has no issues so one cannot be created at this time.");
                    }
                } catch (error) {
                    console.log("Request did not contain information about if the repository has issues enabled - " + error);
                }

            } else {
                console.log("- Response " + response.status + "- Data" + response.data);
            }
        }
    } catch (error) {
        console.log("Ignore Post Payload since it is not a create action" + error);
    }
    if (payload["action"] == 'deleted') {
        console.log("Repo deleted");
    }
    res.sendStatus(200);
});


app.listen(3000, () => console.log("Server listening on port 3000!"));

