# Charter Scrape

Charter (a gym) keeps track of every time that you walk into the gym.
Unfortunately, they don't provide an API to access that information. They
*do* provide a web site, so this script pulls down your data and spits it
out as a CSV. Unfortunately, the whole UI is built with Javascript, so we need
a JS-capable script engine. Enter [PhantomJs](http://phantomjs.org/).

## Requirements

You'll need phantomjs >= 1.7 (so that it can load CommonJS modules.) You will
also need a few such modules (as shown in setup.sh.) I downloaded the modules
with npm, but you could use a different strategy.

You'll also need to create a yaml config with your username and password.
Here's a (non-valid) example:

```yaml
---
  username: myself
  password: secret
```

## Running

```bash
$ phantomjs scrape.js
```
