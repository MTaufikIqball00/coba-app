
require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'lms_db',
    });

    try {
        console.log('Connected to database.');

        // 1. Analyze Schemas
        const [studentCols] = await connection.query('DESCRIBE students');
        const sFields = studentCols.map(c => c.Field);
        console.log('Students Table Cols:', sFields.join(', '));

        const [userCols] = await connection.query('DESCRIBE users');
        const uFields = userCols.map(c => c.Field);
        console.log('Users Table Cols:', uFields.join(', '));

        let hasGradesTable = false;
        let gFields = [];
        try {
            const [gradeCols] = await connection.query('DESCRIBE grades');
            gFields = gradeCols.map(c => c.Field);
            hasGradesTable = true;
            console.log('Grades Table Cols:', gFields.join(', '));
        } catch (e) { }

        let hasAttTable = false;
        try { await connection.query('DESCRIBE attendance'); hasAttTable = true; } catch (e) { }

        // 2. Clean Data
        console.log('Cleaning old data...');
        if (hasGradesTable) await connection.query('DELETE FROM grades');
        if (hasAttTable) await connection.query('DELETE FROM attendance');
        await connection.query('DELETE FROM students');
        await connection.query("DELETE FROM users WHERE id IN ('s1','s2','s3','s4','s5','s6')");

        // 3. Seed Students
        const students = [
            // Group A: Improving / Upward Trend
            { id: 's1', name: 'Andi Pemula', score: 65, att: 70, risk: 'Berisiko Sedang', trend: 'UP' },
            { id: 's2', name: 'Budi Berkembang', score: 78, att: 85, risk: 'Aman', trend: 'UP' },
            { id: 's3', name: 'Citra Juara', score: 92, att: 98, risk: 'Aman', trend: 'UP' },

            // Group B: Declining / Downward Trend
            { id: 's4', name: 'Dedi Menurun', score: 88, att: 90, risk: 'Aman', trend: 'DOWN' },
            { id: 's5', name: 'Eka Warning', score: 70, att: 75, risk: 'Berisiko Sedang', trend: 'DOWN' },
            { id: 's6', name: 'Fajar Kritis', score: 45, att: 50, risk: 'Berisiko Tinggi', trend: 'DOWN' }
        ];

        console.log(`Seeding ${students.length} students...`);

        for (const s of students) {
            // A. Insert User
            let uCols = ['id', 'email', 'password', 'role', 'name'];
            let uPlaceholders = ['?', '?', '?', '?', '?'];
            let uVals = [s.id, `${s.id}@sekolah.id`, 'password123', 'student', s.name];

            if (uFields.includes('school_id')) { uCols.push('school_id'); uVals.push('SCH-001'); uPlaceholders.push('?'); }
            if (uFields.includes('school_name')) { uCols.push('school_name'); uVals.push('SMA Negeri 1 Bandung'); uPlaceholders.push('?'); }
            if (uFields.includes('school_province')) { uCols.push('school_province'); uVals.push('Jawa Barat'); uPlaceholders.push('?'); }

            await connection.execute(
                `INSERT INTO users (${uCols.join(', ')}) VALUES (${uPlaceholders.join(', ')})`,
                uVals
            );

            // B. Insert Student
            let cols = ['id', 'user_id', 'nisn', 'status'];
            let vals = [s.id, s.id, `NISN-${s.id}`, 'active'];
            let placeholders = ['?', '?', '?', '?'];

            if (sFields.includes('class_name')) { cols.push('class_name'); vals.push('XII-IPA-1'); placeholders.push('?'); }
            if (sFields.includes('school_name')) { cols.push('school_name'); vals.push('SMA Negeri 1 Bandung'); placeholders.push('?'); }

            if (sFields.includes('average_score')) { cols.push('average_score'); vals.push(s.score); placeholders.push('?'); }
            if (sFields.includes('attendance_rate')) { cols.push('attendance_rate'); vals.push(s.att); placeholders.push('?'); }
            if (sFields.includes('activity_level')) { cols.push('activity_level'); vals.push(s.att); placeholders.push('?'); }
            if (sFields.includes('risk_status')) { cols.push('risk_status'); vals.push(s.risk); placeholders.push('?'); }

            await connection.execute(
                `INSERT INTO students (${cols.join(', ')}) VALUES (${placeholders.join(', ')})`,
                vals
            );

            // C. Grades (14 Tasks PER SUBJECT)
            if (hasGradesTable) {
                const subjects = ['Matematika', 'Fisika', 'Biologi', 'Kimia', 'Bahasa Inggris', 'Sejarah'];

                for (const subjectName of subjects) {
                    let baseScore = s.score;

                    for (let i = 1; i <= 14; i++) {
                        // Trend Logic per subject
                        let progress = (i / 14);
                        let variance = progress * 30;

                        let subjScore = s.trend === 'UP'
                            ? (baseScore - 15 + variance)
                            : (baseScore + 15 - variance);

                        let subNoise = (subjectName.length * 7) % 10;
                        subjScore += subNoise - 5;
                        subjScore += Math.floor(Math.random() * 8) - 4;
                        subjScore = Math.max(10, Math.min(100, subjScore));

                        let gradeL = subjScore > 85 ? 'A' : (subjScore > 75 ? 'B' : (subjScore > 60 ? 'C' : 'D'));

                        let gCols = ['student_id', 'subject', 'score'];
                        let gVals = [s.id, subjectName, subjScore];
                        let gPh = ['?', '?', '?'];

                        // Optional fields
                        if (gFields.includes('type')) { gCols.push('type'); gVals.push('Tugas'); gPh.push('?'); }
                        // DISTINCT TITLES for the tasks
                        if (gFields.includes('title')) { gCols.push('title'); gVals.push(`Tugas ${i}`); gPh.push('?'); }
                        if (gFields.includes('grade_letter')) { gCols.push('grade_letter'); gVals.push(gradeL); gPh.push('?'); }

                        if (gFields.includes('submitted_at')) {
                            gCols.push('submitted_at');
                            let d = new Date();
                            d.setDate(d.getDate() - (15 - i) * 7);
                            gVals.push(d);
                            gPh.push('?');
                        }

                        await connection.execute(`
                            INSERT INTO grades (${gCols.join(', ')}) VALUES (${gPh.join(', ')})
                         `, gVals);
                    }
                }
            }

            // D. Attendance
            if (hasAttTable) {
                for (let d = 1; d <= 5; d++) {
                    let status = 'present';
                    const roll = Math.random() * 100;
                    if (s.att < 60 && roll > 40) status = 'absent';
                    else if (s.att < 80 && roll > 60) status = 'late';

                    await connection.execute(`
                        INSERT INTO attendance (student_id, date, status, subject)
                        VALUES (?, ?, ?, ?)
                     `, [s.id, new Date(2024, 0, d), status, 'General']);
                }
            }
        }
        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await connection.end();
    }
}

seed();
