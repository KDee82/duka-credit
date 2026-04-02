import { getDB } from './database';

export function addCustomer(name, phone, creditLimit = 0) {
  try {
    const db = getDB();
    const result = db.runSync(
      `INSERT INTO customers (name, phone, credit_limit) VALUES (?, ?, ?)`,
      [name, phone || null, creditLimit]
    );
    return getCustomerById(result.lastInsertRowId);
  } catch (e) {
    console.error('addCustomer failed:', e);
    throw e;
  }
}

export function getAllCustomers() {
  const db = getDB();
  return db.getAllSync(`
    SELECT
      c.*,
      COALESCE(SUM(CASE WHEN t.type = 'credit' AND t.is_voided = 0 THEN t.amount ELSE 0 END), 0)
      - COALESCE(SUM(CASE WHEN t.type = 'payment' AND t.is_voided = 0 THEN t.amount ELSE 0 END), 0)
      AS balance,
      MAX(t.created_at) AS last_transaction_at
    FROM customers c
    LEFT JOIN transactions t ON t.customer_id = c.id
    WHERE c.status = 'active'
    GROUP BY c.id
    ORDER BY balance DESC, c.name ASC
  `);
}

export function getCustomerById(id) {
  const db = getDB();
  const result = db.getFirstSync(`
    SELECT
      c.*,
      COALESCE(SUM(CASE WHEN t.type = 'credit' AND t.is_voided = 0 THEN t.amount ELSE 0 END), 0)
      - COALESCE(SUM(CASE WHEN t.type = 'payment' AND t.is_voided = 0 THEN t.amount ELSE 0 END), 0)
      AS balance
    FROM customers c
    LEFT JOIN transactions t ON t.customer_id = c.id
    WHERE c.id = ?
    GROUP BY c.id
  `, [id]);
  return result;
}

export function updateCustomer(id, fields) {
  const db = getDB();
  const allowed = ['name', 'phone', 'credit_limit', 'status'];
  const updates = [];
  const values = [];
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      updates.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }
  if (updates.length === 0) return;
  updates.push(`updated_at = datetime('now')`);
  values.push(id);
  db.runSync(`UPDATE customers SET ${updates.join(', ')} WHERE id = ?`, values);
  return getCustomerById(id);
}

export function getCustomerBalance(id) {
  const db = getDB();
  const result = db.getFirstSync(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'credit' AND is_voided = 0 THEN amount ELSE 0 END), 0)
      - COALESCE(SUM(CASE WHEN type = 'payment' AND is_voided = 0 THEN amount ELSE 0 END), 0)
      AS balance
    FROM transactions
    WHERE customer_id = ?
  `, [id]);
  return result ? result.balance : 0;
}
