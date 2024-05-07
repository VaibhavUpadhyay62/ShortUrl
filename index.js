require("dotenv").config();
const express = require("express");
const staticRoute = require("./routes/staticRoute");
const path = require("path");
const urlRoute = require("./routes/url");
const URL = require("./model/url");
const { connectToMongoDB } = require("./connect");

const app = express();
const PORT = 8001;

connectToMongoDB(process.env.MONGODB_URL).then(() =>
  console.log("Mongodb connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
