const queries = require("../db/queries");
require("dotenv").config();

exports.getHome = async (req, res) => {
  try{
    const categories = await queries.getAllCategories();
    const items = await queries.getAllItems();
    res.render("index", { categories, items})
  } catch(e) {
    console.log("Error fetching data: ", e);
    res.status(500).send("Server Error");
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await queries.getAllCategories();
    res.render("categories", {categories} );
  } catch(e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await queries.getAllItems();
    const categories = await queries.getAllCategories();
    res.render("items", {items, categories} );
  } catch(e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    await queries.insertCategory(name, description);
    res.redirect("/categories");
  } catch(e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, description, effective_range, damage, fire_rate, accuracy, mobility, control, reload_speed, category_id } = req.body;
    await queries.insertItem(name, description, effective_range, damage, fire_rate, accuracy, mobility, control, reload_speed, category_id);
    res.redirect("/items");
  } catch(e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, effective_range, damage, fire_rate, accuracy, mobility, control, reload_speed, category_id } = req.body;
    await queries.updateItem(id, name, description, effective_range, damage, fire_rate, accuracy, mobility, control, reload_speed, category_id);
    res.redirect("/items");
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteCategory = async (req, res) => {
 try{
    const { id } = req.params;
    const items = await queries.getItemsByCategory(id);
    if (items.length > 0) {
      return res.status(400).send("Cannot delete category with existing items!");
    }
    await queries.deleteCategory(id);
    res.redirect("/categories");
 } catch(e) {
    console.log(e);
    res.status(500).send("Server Error");
 }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await queries.deleteItem(id);
    res.redirect("/items");
  } catch(e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
};

exports.verifyAdmin = (req, res) => {
  if (req.body.password !== process.env.SECRET_ADMIN_PASSWORD) {
    return res.status(403).send("Unauthorized: Incorrect admin password.");
  }
  res.send("Admin Verified");
};
