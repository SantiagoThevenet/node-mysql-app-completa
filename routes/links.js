const express = require('express');
const { reconstructFieldPath } = require('express-validator/src/select-fields');
const { pool } = require('../database');
const router = express.Router();


/* GET users listing. */
router.get('/', async (req, res, next) => {
  const [links] = await pool.query("SELECT * FROM links")
  console.log(links);
  res.render("links/list", { links })
});

router.get("/add", (req, res) => {
  res.render('links/add')
})


router.post("/add", (req, res) => {
  const { title, url, description } = req.body
  const newLink = {
    title,
    url,
    description
  }
  console.log(newLink);
  pool.query("INSERT INTO links SET ?", [newLink])
  req.flash("success", "Link saved successuflly :D")

  res.redirect('/links')

})

router.get("/delete/:id", async (req, res) => {
  const { id } = req.params
  await pool.query("DELETE FROM links WHERE id = ?", [id])
  res.redirect('/links')
})

router.get("/edit/:id", async (req, res) => {
  const { id } = req.params
  const [link] = await pool.query("SELECT * FROM links WHERE id = ?", [id])
  console.log(link);
  res.render("links/edit", { link: link[0] })
})

router.post('/edit/:id', async(req, res) => {
  const { id } = req.params
  const { title, url, description } = req.body
  const newLink = {
    title,
    url,
    description
  }
  await pool.query('UPDATE links SET ? WHERE id = ?',[newLink,id])
  req.flash("success", "Link saved successuflly :D")
  res.redirect('/links')
})
module.exports = router;
