# gitlab-repos

Express middleware to grab repository information from GitLabs REST API on an interval (default 1h).

This module uses the http module and is not secure, it is for use with a local gitlab instance.

# JDoc

```js
/**
 *
 * @param {Object}  options - GitLabRepos options
 * @param {string}  options.user - GitLab user to get repos for
 * @param {string}  options.hostname - GitLab hostname / IP address
 * @param {integer} options.port - GitLab API port number
 * @param {string}  options.token - GitLab API access token
 * @param {string}  [options.sort=desc] - How to sort the repositories
 * @param {string}  [options.order=created_at] - How to order the repositories
 * @param {integer} [options.interval=3600000] - Interval time (default 1h)
 * @throws Missing options.hostname...
 * @throws Missing options.token...
 * @throws Missing options.port...
 * @throws Missing options.user...
 */
```

# Usage

```js
const GitLab = require("./modules/gitlab-repos/gitlab-repos");
const express = require("express");

let app = express();

app.use(GitLab({
  user: "cekeh",
  hostname: "192.168.1.200",
  port: 9080,
  token: "gitlab-access-token"
}));

app.get("*", (req, res) => {
  console.log(req.gitlab_repos);
});

app.listen(8000);
```
