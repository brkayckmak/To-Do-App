import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  host: //Your host,
  user: //Your user,
  password: //Your password,
  port: //Your port,
  database: //Your database,
});

db.connect();

app.get("/", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM items ORDER BY id ASC");
    let items = response.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query(`INSERT INTO items (title) VALUES ('${item}')`);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit", async (req, res) => {
  const updatedItemId = req.body.updatedItemId;
  const updatedTitle = req.body.updatedItemTitle;
  try {
    await db.query(
      `UPDATE items SET title = '${updatedTitle}' WHERE id=${updatedItemId}`
    );
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", async (req, res) => {
  const deleteItemId = req.body.deleteItemId;
  try {
    await db.query(`DELETE FROM items WHERE id=${deleteItemId}`);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
