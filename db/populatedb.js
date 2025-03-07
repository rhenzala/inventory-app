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
  effective_range INT NOT NULL,
  damage INT NOT NULL,
  fire_rate INT NOT NULL,
  accuracy INT NOT NULL,
  mobility INT NOT NULL,
  control INT NOT NULL,
  reload_speed DECIMAL(4,2) NOT NULL,
  category_id INT REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name, description) 
VALUES 
  ('Assault Rifles', 'Assault Rifles'),
  ('Sniper Rifles', 'Sniper Rifles'),
  ('SMG', 'Sub Machine Guns')
ON CONFLICT DO NOTHING;

INSERT INTO items (name, description, effective_range, damage, fire_rate, accuracy, mobility, control, reload_speed, category_id) 
VALUES 
  ('M4', 'Low recoil, beginner-friendly AR with decent stats.', 40, 30, 68, 80, 75, 80, 2.1, 1),
  ('QQ9', 'Versatile, fast-firing SMG with great mobility.', 18, 32, 90, 60, 90, 65, 1.9, 3),
  ('DLQ33', 'One-shot sniper with great range and accuracy.', 80, 90, 35, 95, 40, 85, 3.2, 2),
  ('AK-47', 'High-damage, slow fire rate AR with strong recoil.', 35, 40, 55, 60, 70, 50 , 2.5, 1),
  ('Locus', 'Faster ADS and reload but lower damage than DL Q33.', 75, 85, 40, 90, 50, 80, 2.8, 2),
  ('CBR4', 'Insane fire rate but lower range and control.', 15, 25, 95, 55, 95, 50, 2.2, 3)

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
