import { getDB } from './database';

// Add a new customer
export const addCustomer = (name, phone = '', creditLimit = 0) => {
  const db = getDB();
  const result = db.runSync(
    `INSERT INTO customers (name, phone, credit_limit) VALUES (?, ?, ?)`,
    [name.trim(), phone.trim(), creditLimit]
  );
  return { id: result.lastInsertRowId, name, phone, credit_limit: creditLimit, status: 'active', balance: 0 };
};

// Get all active customers with their current balance
export const getAllCustomers = () => {
  const db = getDB();
  const rows = db.getAllSync(`
    SELECT
      c.id,
      c.name,
      c.phone,
      c.credit_limit,
      c.status,
      c.created_at,
      c.updated_at,
      COALESCE(
        SUM(CASE WHEN t.type = 'credit' AND t.is_voided = 0 THEN t.amount ELSE 0 END) -
        SUM(CASE WHEN t.type = 'payment' AND t.is_voided = 0 THEN t.amount ELSE 0 END),
        0
      ) AS balance,
      MAX(t.created_at) AS last_activity
    FROM customers c
    LEFT JOIN transactions t ON t.customer_id = c.id
    WHERE c.status != 'deleted'
    GROUP BY c.id
    ORDER BY balance DESC, c.name ASC
  `);
  return rows;
};

// Get a single customer with balance
export const getCustomerById = (id) => {
  const db = getDB();
  const row = db.getFirstSync(`
    SELECT
      c.id,
      c.name,
      c.phone,
      c.credit_limit,
      c.status,
      c.created_at,
      COALESCE(
        SUM(CASE WHEN t.type = 'credit' AND t.is_voided = 0 THEN t.amount ELSE 0 END) -
        SUM(CASE WHEN t.type = 'payment' AND t.is_voided = 0 THEN t.amount ELSE 0 END),
        0
      ) AS balance
    FROM customers c
    LEFT JOIN transactions t ON t.customer_id = c.id
    WHERE c.id = ?
    GROUP BY c.id
  `, [id]);
  return row;
};

// Get just the balance for a customer
export const getCustomerBalance = (customerId) => {
  const db = getDB();
  const row = db.getFirstSync(`
    SELECT
      COALESCE(
        SUM(CASE WHEN type = 'credit' AND is_voided = 0 THEN amount ELSE 0 END) -
        SUM(CASE WHEN type = 'payment' AND is_voided = 0 THEN amount ELSE 0 END),
        0
      ) AS balance
    FROM transactions
    WHERE customer_id = ?
  `, [customerId]);
  return row ? row.balance : 0;
};

// Update customer fields
export const updateCustomer = (id, fields) => {
  const db = getDB();
  const { name, phone, credit_limit, status } = fields;
  db.runSync(
    `UPDATE customers SET name = ?, phone = ?, credit_limit = ?, status = ?, updated_at = datetime('now', 'localtime') WHERE id = ?`,
    [name, phone, credit_limit, status, id]
  );
};

// Search customers by name or phone
export const searchCustomers = (query) => {
  const db = getDB();
  const like = `%${query}%`;
  const rows = db.getAllSync(`
    SELECT
      c.id,
      c.name,
      c.phone,
      c.credit_limit,
      c.status,
      COALESCE(
        SUM(CASE WHEN t.type = 'credit' AND t.is_voided = 0 THEN t.amount ELSE 0 END) -
        SUM(CASE WHEN t.type = 'payment' AND t.is_voided = 0 THEN t.amount ELSE 0 END),
        0
      ) AS balance
    FROM customers c
    LEFT JOIN transactions t ON t.customer_id = c.id
    WHERE c.status != 'deleted' AND (c.name LIKE ? OR c.phone LIKE ?)
    GROUP BY c.id
    ORDER BY balance DESC
  `, [like, like]);
  return rows;
};
