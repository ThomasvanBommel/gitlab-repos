/**
 * GitLab repo grabber
 * @author Thomas vanBommel
 * @since 12-22-2020
 */
 const http = require("http");

class GitLabRepos {
  constructor(options){
    this.options = options;
    this.repos = [];

    this.update();
    setInterval(this.update, options.interval ? options.interval : 3600000);
  }

  update = () => {
    let req = http.request(this.options, res => {
      let data = "";
      // console.log(res.headers);

      res.on("data", d => { data += d; });
      res.on("end", () => {
        // console.log(JSON.parse(data));
        this.repos = JSON.parse(data);
        console.log(`${new Date().toISOString()} Updated GitLab Repositories`);
      });
    });

    req.on("error", err => console.error(err));
    req.end();
  };

  middleware = (req, res, next) => {
    req.gitlab_repos = this.repos;
    next();
  };
}

module.exports = options => {
  return new GitLabRepos(options).middleware;
};
