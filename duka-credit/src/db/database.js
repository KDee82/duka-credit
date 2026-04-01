import * as SQLite from 'expo-sqlite';

let db = null;

export const getDB = () => {
  if (!db) {
    db = SQLite.openDatabaseSync('duka_credit.db');
  }
  return db;
};

export const initDB = async () => {
  const database = getDB();

  // Customers table
  database.execSync(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      credit_limit REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // Transactions table
  database.execSync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      note TEXT,
      entered_by TEXT DEFAULT 'owner',
      is_voided INTEGER DEFAULT 0,
      voided_at TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
  `);

  console.log('Database initialised successfully');
};
