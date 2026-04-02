import { getDB } from './database';

export function addTransaction(customerId, type, amount, description = '', note = '') {
  const db = getDB();
  const result = db.runSync(
    `INSERT INTO transactions (customer_id, type, amount, description, note) VALUES (?, ?, ?, ?, ?)`,
    [customerId, type, amount, description || null, note || null]
  );
  return db.getFirstSync(
    `SELECT * FROM transactions WHERE id = ?`,
    [result.lastInsertRowId]
  );
}

export function getTransactionsByCustomer(customerId) {
  const db = getDB();
  return db.getAllSync(
    `SELECT * FROM transactions WHERE customer_id = ? ORDER BY created_at DESC`,
    [customerId]
  );
}

export function voidTransaction(id) {
  const db = getDB();
  db.runSync(
    `UPDATE transactions SET is_voided = 1, voided_at = datetime('now') WHERE id = ?`,
    [id]
  );
}

export function getTodaySummary() {
  const db = getDB();
  const result = db.getFirstSync(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'credit' AND is_voided = 0 THEN amount ELSE 0 END), 0) AS credits,
      COALESCE(SUM(CASE WHEN type = 'payment' AND is_voided = 0 THEN amount ELSE 0 END), 0) AS payments
    FROM transactions
    WHERE date(created_at) = date('now')
  `);
  return result || { credits: 0, payments: 0 };
}

export function getTopDebtors(limit = 5) {
  const db = getDB();
  return db.getAllSync(`
    SELECT
      c.*,
      COALESCE(SUM(CASE WHEN t.type = 'credit' AND t.is_voided = 0 THEN t.amount ELSE 0 END), 0)
      - COALESCE(SUM(CASE WHEN t.type = 'payment' AND t.is_voided = 0 THEN t.amount ELSE 0 END), 0)
      AS balance
    FROM customers c
    LEFT JOIN transactions t ON t.customer_id = c.id
    WHERE c.status = 'active'
    GROUP BY c.id
    HAVING balance > 0
    ORDER BY balance DESC
    LIMIT ?
  `, [limit]);
}

export function getTotalOutstanding() {
  const db = getDB();
  const result = db.getFirstSync(`
    SELECT
      COALESCE(SUM(CASE WHEN t.type = 'credit' AND t.is_voided = 0 THEN t.amount ELSE 0 END), 0)
      - COALESCE(SUM(CASE WHEN t.type = 'payment' AND t.is_voided = 0 THEN t.amount ELSE 0 END), 0)
      AS total_outstanding
    FROM transactions t
    JOIN customers c ON c.id = t.customer_id
    WHERE c.status = 'active'
  `);
  return result ? result.total_outstanding : 0;
}
