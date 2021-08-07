const nanoid = require("nanoid").nanoid;
const isValidHttpUrl = require("../helpers.js").isValidHttpUrl;
const auth = require("../auth.js");

async function shortening(req, res) {
  const db = req.app.get("db");

  const longUrl = req.body.url;
  if (!isValidHttpUrl(longUrl)) {
    return res.status(402).json({ message: "url is invalid!" });
  }

  let succeed = true;
  let key;
  while (succeed) {
    key = nanoid(6);
    console.log(key);
    try {
      await db.insert(longUrl, key);
      succeed = false;
    } catch (e) {
      console.log("there was a duplicate key!");
    }
  }
  res.status(200).json({ shortUrl: key });
}

async function redirecting(req, res) {
  const db = req.app.get("db");

  const key = req.params.key;
  const url = await db.get(key);
  if (url) {
    console.log(url);
    return res.redirect(url.value);
  }
  return res.status(404).end();
}

async function register(req, res) {
  const db = req.app.get("db");
  const users = await db.get("users");
  const { username, password } = req.body;

  if (!(username && password)) {
    return res.status(400).end("username and password are required!");
  }

  if (users && users[username]) {
    return res.status(400).end("this username already exists!");
  }

  const user = {
    username,
    password: await auth.hashPassword(password),
    history: [],
  };
  try {
    const createdUser = await db.put(user);
    const token = await auth.generateToken(user);
    let newUsers = { ...users };
    if (newUsers) {
      newUsers = { ...newUsers, [username]: createdUser.key };
    } else {
      newUsers = { [username]: createdUser.key };
    }
    db.put(newUsers, "users");
    const { password: _, ...otherData } = user;
    res.json({ data: { token, user: otherData } });
  } catch (e) {
    console.log(e);
  }
}

async function login(req, res) {
  const db = req.app.get("db");
  const users = await db.get("users");
  const { username, password } = req.body;

  if (!(username && password)) {
    return res.status(400).end("username and password are required!");
  }

  try {
    const user = await db.get(users[username]);
    if (user && (await auth.checkPassword(password, user.password))) {
      const token = await auth.generateToken(user);
      const { password: _, ...otherData } = user;
      res.json({ data: { token, user: otherData } });
    } else {
      res.status(401).end("username and password wrong combination!");
    }
  } catch (e) {
    console.log(e);
  }
}

async function checkToken(req, res) {
  res.json(await auth.verifyToken(req.body.token));
}

exports.shortening = shortening;
exports.redirecting = redirecting;
exports.register = register;
exports.login = login;
exports.checkToken = checkToken;
