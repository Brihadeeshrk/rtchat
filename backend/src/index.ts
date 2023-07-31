import express from "express";
const app = express();
const port = 8000;

app.get("/", (req, res, next) => {
  res.send("Hello World, From TypeScript");
});

app.listen(port, () => {
  return console.log(`🚀 Express listening on port ${port}`);
});
