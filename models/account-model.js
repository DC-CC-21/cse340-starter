const pool = require("../database");
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    console.log(error);
    return error.message;
  }
}

async function checkExistingAccount(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rows[0];
  } catch (error) {
    console.log(error);
    return error.message;
  }
}

async function changePassword(account_password, account_id) {
  try {
    const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
    RETURNING *`;
    return (
      await pool.query(sql, [account_password, account_id])
    ).rows[0];
  } catch (error) {
    console.log(error);
    return error.message;
  }
}

// async function loginAccount(
//   account_email,
//   account_password
// ) {
//   try {
//     const sql =
//       "SELECT * FROM account WHERE account_email = $1 AND account_password = $2";
//     const login = await pool.query(sql, [
//       account_email,
//       account_password,
//     ]);
//     return login.rowCount;
//   } catch (error) {
//     return error.message;
//   }
// }
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rows[0];
  } catch (error) {
    return new Error("No mathing email found");
  }
}

async function updateAccount(
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    const sql =
      "UPDATE account SET account_firstname = $1, account_lastname = $2 WHERE account_email = $3 RETURNING *";
    return (
      await pool.query(sql, [
        account_firstname,
        account_lastname,
        account_email,
      ])
    ).rows[0];
  } catch (error) {
    console.log(error);
    return error.message;
  }
}

async function getAccountById(account_id) {
  try {
    const sql = "SELECT * FROM account WHERE account_id = $1";
    const id = await pool.query(sql, [account_id]);
    return id.rows[0];
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  registerAccount,
  checkExistingAccount,
  getAccountByEmail,
  updateAccount,
  changePassword,
  getAccountById
};
