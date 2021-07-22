import { nanoid } from "nanoid";
import { isValidHttpUrl } from "../helpers.mjs";
export async function shortening(req, res) {
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

export async function redirecting(req, res) {
  const db = req.app.get("db");

  const key = req.params.key;
  const url = await db.get(key);
  if (url) {
    console.log(url);
    return res.redirect(url.value);
  }
  return res.status(404).end();
}
