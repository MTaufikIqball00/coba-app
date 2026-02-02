
require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');

async function check() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'lms_db',
    });

    try {
        const [rows] = await connection.query('SELECT * FROM grades WHERE student_id = ? ORDER BY submitted_at ASC', ['s1']);
        console.log(`Found ${rows.length} grades for s1.`);
        if (rows.length > 0) {
            console.log('Sample:', rows[0]);
            console.log('Subjects:', [...new Set(rows.map(r => r.subject))]);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await connection.end();
    }
}
check();
