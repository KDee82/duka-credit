import { getDB } from './database';

// Add a new transaction
export const addTransaction = (customerId, type, amount, description = '', note = '', enteredBy = 'owner') => {
  const db = getDB();
  const result = db.runSync(
    `INSERT INTO transactions (customer_id, type, amount, description, note, entered_by) VALUES (?, ?, ?, ?, ?, ?)`,
    [customerId, type, amount, description.trim(), note.trim(), enteredBy]
  );
  return result.lastInsertRowId;
};

// Get all transactions for a customer (newest first), with running balance
export const getTransactionsByCustomer = (customerId) => {
  const db = getDB();
  const rows = db.getAllSync(`
    SELECT * FROM transactions
    WHERE customer_id = ?
    ORDER BY created_at DESC, id DESC
  `, [customerId]);

  // Calculate running balance (front to back in chronological order, then reverse)
  const chronological = [...rows].reverse();
  let running = 0;
  const withBalance = chronological.map(t => {
    if (!t.is_voided) {
      running += t.type === 'credit' ? t.amount : -t.amount;
    }
    return { ...t, running_balance: running };
  });

  return withBalance.reverse(); // newest first again
};

// Void a transaction (soft delete with audit trail)
export const voidTransaction = (id) => {
  const db = getDB();
  db.runSync(
    `UPDATE transactions SET is_voided = 1, voided_at = datetime('now', 'localtime') WHERE id = ?`,
    [id]
  );
};

// Today's summary: total credit given and payments received
export const getTodaySummary = () => {
  const db = getDB();
  const row = db.getFirstSync(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'credit' AND is_voided = 0 THEN amount ELSE 0 END), 0) AS total_credit,
      COALESCE(SUM(CASE WHEN type = 'payment' AND is_voided = 0 THEN amount ELSE 0 END), 0) AS total_payments
    FROM transactions
    WHERE date(created_at) = date('now', 'localtime')
  `);
  return row || { total_credit: 0, total_payments: 0 };
};

// Total outstanding across all customers
export const getTotalOutstanding = () => {
  const db = getDB();
  const row = db.getFirstSync(`
    SELECT
      COALESCE(
        SUM(CASE WHEN type = 'credit' AND is_voided = 0 THEN amount ELSE 0 END) -
        SUM(CASE WHEN type = 'payment' AND is_voided = 0 THEN amount ELSE 0 END),
        0
      ) AS total
    FROM transactions
  `);
  return row ? row.total : 0;
};

// Get top N debtors
export const getTopDebtors = (limit = 5) => {
  const db = getDB();
  const rows = db.getAllSync(`
    SELECT
      c.id,
      c.name,
      c.phone,
      COALESCE(
        SUM(CASE WHEN t.type = 'credit' AND t.is_voided = 0 THEN t.amount ELSE 0 END) -
        SUM(CASE WHEN t.type = 'payment' AND t.is_voided = 0 THEN t.amount ELSE 0 END),
        0
      ) AS balance
    FROM customers c
    LEFT JOIN transactions t ON t.customer_id = c.id
    WHERE c.status = 'active'
    GROUP BY c.id
    HAVING balance > 0
    ORDER BY balance DESC
    LIMIT ?
  `, [limit]);
  return rows;
};
