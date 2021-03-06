# Repository Branch Protection and Notification
Repository Branch Protection and Notification is a simple web service that listens for organization events to know when a repository has been created. When the repository is created this web service automates the protection of the main branch. It also notifies you with an @mention in an issue within the repository that outlines the protections that were added.

## Usage
- Install the following:
    - [Node.js and npm](https://nodejs.org/en/download/) 
        - `install npm` for npm
    - @Octokit/core - A minimalistic library to utilize GitHub's REST API
        - `node install @Octokit/core`
    - [ngrok](https://dashboard.ngrok.com/get-started) - One command for an instant, secure URL to your localhost server through any NAT or firewall and helps in Building webhook consumers on your dev machine
- Set GH_TOKEN as an environment variable with a value that corresponds to a GitHub PAT 
- Start the local web service via `nodemon index.js`
<!-- markdownlint-disable -->
- Start the forwarding service via `ngrok http 3000`
- Note the forwarding address (ie. ` http://xxxxxxxx.ngrok.io` in the output of the ngrok application)
<!-- markdownlint-disable -->
- Set up a WebHook in the desired GitHub organization [example](https://github.com/buzzmoto-org/REPO/settings/hooks)
    - Note that the Payload URL should match the forwarding address from [ngrok](http://xxxxxxxx.ngrok.io)
    - Select the individual events radio button and check repositories
    - Content type should be application/json
    - Save the Webhook
- Create a repository
- See that branch protection and an issue was created for the repo!

## Related Documentation
- [GitHub APIv3](https://developer.github.com/v3/)
   - This solution utilizes Github REST API, github provides another approach the [GraphQL API](https://docs.github.com/en/graphql) designed to solve different challenges. GraphQL is designed specifically allowing to query data models, while REST is designed to act in a similar fashion to the semantic Web - allowing to have agile, changing and versionless APIs.  
- [Web Hooks](https://developer.github.com/webhooks/) 
   - Webhooks allow you to build or set up integrations, which subscribe to certain events on GitHub.com. When one of those events is triggered, github sends a HTTP POST payload to the webhook's configured URL. Webhooks can be used to update an external issue tracker, trigger CI builds, update a backup mirror, or even deploy to the production server.
- [API Status](https://www.githubstatus.com/)
- [ngrok](https://ngrok.com/docs)

## Dependencies and Attribution
- Node
- Octokit
- ngrok

