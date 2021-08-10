# ENV Switcher

Switch between locale based enviroments easily

## Configuration

### Edit repos.js with your repo paths

List out the absolute paths and command(optional) to run in the that path. env will be replaced by default for every path given. the format is,

```javascript
{
  path: "/absolute/path/to/repo/laravel-api",
  command: "php artisan migrate:fresh --seed", // optional
}
```

For example,

```javascript
module.exports = [
  {
    path: "/Users/user-name/path/to/api-system-configuration/src",
    command: "php artisan migrate:fresh --seed",
  },
  {
    path: "/Users/user-name/path/to/api-referrals/laravel-api",
    command: "php artisan migrate:fresh --seed",
  },
];
```

### Edit .env files

Create/edit two env files namely `.gb.env` and `.us.env` for corresponding enviroments. and add all the variables that needs to be **replaced** in the target repos.

**Note: Any variable that's listed in these env files will be reflected in the target repos only if that variable already exists in that repo's env file. This helps us to have all the region based variables related to all the repos in these two files only.**

For example,my `.env.gb` contains the following

```
APP_REGION=GB
APP_LOCALE=en_GB
APP_CURRENCY=GBP

# configuration-api envs
SOMETHING_SPECIFIC_TO_GB=false

# api-notifications envs
AWS_BUCKET=uk-west-2
```

The above will not pollute any repo that doesn't have those specific keys.

## Known Issues

Using this on an env file will make the file lose all it's empty lines, bacause technically we are re-writing the whole file.

## Usage

```bash
$ yarn install

# to switch to GB env
$ yarn switch:gb

# to switch to US env
$ yarn switch:us

# silent mode?
$ yarn switch:gb silent
$ yarn switch:us silent
```

## Contributing

Pull requests are welcome.
