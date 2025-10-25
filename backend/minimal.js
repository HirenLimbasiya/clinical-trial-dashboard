import express from "express";

const app = express();
app.get("/test", (req, res) => res.send({ message: "OK" }));
app.listen(5001, "127.0.0.1", () =>
  console.log("Server running on 127.0.0.1:5001")
);
