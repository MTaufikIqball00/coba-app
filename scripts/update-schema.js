const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function run() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'lms_db',
    });

    try {
        console.log('Connected to database.');

        // Create Activities Table
        await connection.query(`
        CREATE TABLE IF NOT EXISTS activities (
            id VARCHAR(50) PRIMARY KEY,
            student_id VARCHAR(50),
            type VARCHAR(50),
            title VARCHAR(255),
            description TEXT,
            timestamp DATETIME,
            metadata JSON,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
        console.log('Activities table created.');

        // Create Forum Rooms Table
        await connection.query(`
        CREATE TABLE IF NOT EXISTS forum_rooms (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(100),
            subject VARCHAR(100),
            class_id VARCHAR(50),
            call_id VARCHAR(100),
            participants INT DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
        console.log('Forum Rooms table created.');

        // Seed Forum Rooms (Basic)
        const [rows] = await connection.query("SELECT COUNT(*) as count FROM forum_rooms");
        if (rows[0].count === 0) {
            await connection.query(`
            INSERT INTO forum_rooms (id, name, subject, class_id, call_id, participants, is_active) VALUES
            ('umum-general', 'Forum Umum', 'umum', 'general', 'general-meeting', 127, true),
            ('matematika', 'Matematika', 'matematika', NULL, 'matematika-main-call', 45, true),
            ('fisika', 'Fisika', 'fisika', NULL, 'fisika-main-call', 30, false),
            ('kimia', 'Kimia', 'kimia', NULL, 'kimia-main-call', 25, true),
            ('biologi', 'Biologi', 'biologi', NULL, 'biologi-main-call', 40, true)
        `);
            console.log('Seeded Forum Rooms.');
        }

        // Seed Activities (for s1/s2)
        // IDs: act1, act2...
        // s1 is mapped to Budi Pekerti (user u_s1). ID 's1' exists in students.
        try {
            await connection.query(`
            INSERT INTO activities (id, student_id, type, title, description, timestamp) VALUES
            ('act1', 's1', 'assignment_submit', 'Tugas Fisika Dikumpulkan', 'Menyerahkan tugas tentang Hukum Newton.', '2024-05-10 08:00:00'),
            ('act2', 's1', 'quiz_complete', 'Kuis Matematika Selesai', 'Menyelesaikan kuis Kalkulus Dasar dengan skor 85.', '2024-05-11 09:30:00'),
            ('act3', 's1', 'login', 'Login ke Sistem', 'Login dari perangkat seluler.', '2024-05-20 07:55:00'),
            ('act4', 's2', 'assignment_submit', 'Tugas Kimia Dikumpulkan', 'Menyerahkan tugas tentang Struktur Atom.', '2024-05-12 08:00:00')
        `);
            console.log('Seeded Activities.');
        } catch (e) {
            // Ignore duplicate entry errors
            if (!e.message.includes('Duplicate entry')) console.error('Seed activities error:', e.message);
        }

    } catch (error) {
        console.error('Schema update failed:', error.message);
    } finally {
        await connection.end();
    }
}

run();
