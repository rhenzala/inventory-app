require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity >= 0),
  category_id INT REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name, description) 
VALUES 
  ('Electronics', 'Devices and gadgets'),
  ('Clothing', 'Apparel and fashion items'),
  ('Groceries', 'Food and household items')
ON CONFLICT DO NOTHING;

INSERT INTO items (name, description, price, quantity, category_id) 
VALUES 
  ('Laptop', 'High-performance laptop', 1200.00, 10, 1),
  ('Headphones', 'Noise-canceling headphones', 200.00, 15, 1),
  ('T-Shirt', 'Cotton t-shirt', 25.00, 50, 2),
  ('Jeans', 'Denim jeans', 40.00, 30, 2),
  ('Milk', '1L organic whole milk', 3.50, 20, 3),
  ('Bread', 'Whole wheat bread', 2.00, 25, 3)
ON CONFLICT DO NOTHING;
`;

async function main() {
  console.log("Seeding database...");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, 
  });

  try {
    await client.connect();
    console.log("Connected to DB");

    await client.query(SQL);
    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Database error:", err);
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
}

main();
