const pool = require("./pool");

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories ORDER BY created_at DESC");
  return rows;
}

async function getAllItems() {
  const { rows } = await pool.query(`
    SELECT items.*, categories.name AS category_name 
    FROM items 
    JOIN categories ON items.category_id = categories.id
    ORDER BY items.created_at DESC
  `);
  return rows;
}

async function getItemsByCategory(categoryId) {
  const { rows } = await pool.query(`
    SELECT * FROM items WHERE category_id = $1 ORDER BY created_at DESC
  `, [categoryId]);
  return rows;
}

async function getItemById(itemId) {
  const { rows } = await pool.query("SELECT * FROM items WHERE id = $1", [itemId]);
  return rows[0]; 
}

async function insertCategory(name, description) {
  await pool.query("INSERT INTO categories (name, description) VALUES ($1, $2)", [name, description]);
}

async function insertItem(name, description, effective_range, damage, fire_rate, accuracy, mobility, control, reload_speed, categoryId) {
  await pool.query(
    "INSERT INTO items (name, description, effective_range, damage, fire_rate, accuracy, mobility, control, reload_speed, category_id) VALUES ($1, $2, $3, $4, $5)",
    [name, description, effective_range, damage, fire_rate, accuracy, mobility, control, reload_speed, categoryId]
  );
}

async function updateItem(itemId, name, description, effective_range, damage, fire_rate, accuracy, mobility, control, reload_speed, categoryId) {
  await pool.query(
    "UPDATE items SET name = $1, description = $2, effective_range = $3, damage = $4, fire_rate = $5, accuracy = $6, mobility = $7, control = $8, reload_speed = $9, category_id = $10 WHERE id = $11",
    [name, description, effective_range, damage, fire_rate, accuracy, mobility, control, reload_speed, categoryId, itemId]
  );
}

async function deleteItem(itemId) {
  await pool.query("DELETE FROM items WHERE id = $1", [itemId]);
}

async function deleteCategory(categoryId) {
  await pool.query("DELETE FROM categories WHERE id = $1", [categoryId]);
}

module.exports = {
  getAllCategories,
  getAllItems,
  getItemsByCategory,
  getItemById,
  insertCategory,
  insertItem,
  updateItem,
  deleteItem,
  deleteCategory,
};
