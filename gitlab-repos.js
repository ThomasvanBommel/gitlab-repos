/**
 * GitLab repo grabber
 * @author Thomas vanBommel
 * @since 12-22-2020
 */
 const http = require("http");

class GitLabRepos {
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
  constructor(options){
    // ensure correct options exist
    if(!options.hostname) throw "Missing options.hostname...";
    if(!options.token) throw "Missing options.token...";
    if(!options.port) throw "Missing options.port...";
    if(!options.user) throw "Missing options.user...";

    // set up default options
    options.method = "GET";
    options.sort = options.sort ? options.sort : "desc";
    options.order = options.order ? options.order : "created_at";
    options.interval = options.interval ? options.interval : 3600000;

    // set up gitlab options
    options.headers = { "PRIVATE-TOKEN": options.token };
    options.path = `/api/v4/users/${options.user}/projects` +
                   `?order_by=${options.order}&sort=${options.sort}`;

    // set up options and empty repos objects
    this.options = options;
    this.repos = [];

    // update once, and again every interval (default 1h)
    this.update();
    setInterval(this.update, options.interval);
  }

  /** Update repos */
  update = () => {
    // set up request object
    let req = http.request(this.options, res => {
      // accumulative data
      let data = "";

      // still responding... accumulate data
      res.on("data", d => { data += d; });

      // end of response
      res.on("end", () => {
        // parse data
        this.repos = JSON.parse(data);

        // log update and time
        console.log(`${new Date().toISOString()} Updated GitLab Repositories`);
      });
    });

    // log errors and send request
    req.on("error", err => console.error(err));
    req.end();
  };

  /**
   * Express middleware (adds repos to req.github_repos)
   * @param {Object} req - Express request "req" object
   * @param {Object} res - Express response "res" object
   * @param {Object} next - Express "next" middleware object
   */
  middleware = (req, res, next) => {
    req.gitlab_repos = this.repos;
    next();
  };
}

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
module.exports = options => {
  return new GitLabRepos(options).middleware;
};
