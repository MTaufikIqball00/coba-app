
require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');

async function debugFajar() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'lms_db',
    });

    try {
        const [rows] = await connection.query("SELECT * FROM students WHERE id = 's6'");
        const s = rows[0];
        console.log('Raw DB Data for Fajar:', s);

        // Emulate API Logic
        const normGPA = Math.min(Math.max((s.gpa || 0) / 4.0, 0), 1);
        const normAtt = Math.min(Math.max((s.attendance_rate || 0) / 100.0, 0), 1);
        const riskScore = Number(((normGPA * 60) + (normAtt * 40)).toFixed(2));

        let riskStatus = "Aman";
        if (riskScore < 50) riskStatus = "Berisiko Tinggi";
        else if (riskScore < 75) riskStatus = "Berisiko Sedang";

        console.log('Calculated:', { normGPA, normAtt, riskScore, riskStatus });

    } catch (e) { console.error(e); }
    finally { await connection.end(); }
}
debugFajar();
