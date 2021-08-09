const promisify = require("util").promisify;
const fs = require("fs");
const { parse, stringify } = require("envfile");
const childProcess = require("child_process");
const repos = require("./repos");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exec = promisify(childProcess.exec);

const getLocaleFromArgs = () => {
  return process.argv[2].toLowerCase();
};

const getSilentFlagFromArgs = () => {
  return process.argv[3] === "silent";
};

const getRequiredChanges = (locale) => {
  let promise = null;
  if (locale === "us") {
    promise = readFile(".us.env");
  } else if (locale === "gb") {
    promise = readFile(".gb.env");
  }
  return promise
    .then((buffer) => buffer.toString())
    .then((data) => parse(data));
};

const locale = getLocaleFromArgs();
const isSilent = getSilentFlagFromArgs();

getRequiredChanges(locale).then((requiredChanges) => {
  const promises = repos.map((repo) => {
    const envPath = `${repo.path}/.env`;
    return readFile(envPath)
      .then((data) => {
        const parsedEnv = parse(data.toString());
        const newEnv = { ...parsedEnv };
        Object.entries(requiredChanges).forEach(([key, value]) => {
          if (newEnv[key]) {
            newEnv[key] = value;
          }
        });
        return writeFile(envPath, stringify(newEnv));
      })
      .then(() => {
        console.log(
          "\x1b[33m%s\x1b[0m",
          `\n🔗 Running command in ${repo.path}\n`
        );
        if (repo.command)
          return exec(repo.command, { cwd: repo.path }).then((output) => {
            console.log("\x1b[33m%s\x1b[0m", `✅ Done in ${repo.path}\n`);
            if (!isSilent) {
              console.log(output.stdout);
            }
          });
        else return Promise.resolve(true);
      });
  });
  Promise.all(promises).then(() =>
    console.log("\x1b[33m%s\x1b[0m", "\n🍰 Everything went fine 🍰")
  );
});
