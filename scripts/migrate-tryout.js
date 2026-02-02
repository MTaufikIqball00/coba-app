const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' }); // Load env variables


// Since tryoutdata.ts uses 'export const', we might need to handle it if we read it as a module
// Or just read file content strings if basic require fails due to TS syntax.
// However, assuming user has ts-node or we can just read the file content.
// Wait, tryoutdata.ts is TS. We can't require it directly in JS node script without compilation or ts-node.
// I will parse the TS file content MANUALLY or use a hardcoded version of the data for the seed script to avoid TS setup issues.

// Simplified approach: Re-declare the data here to avoid TS complexity in a simple migration script.
// I will copy the data from tryoutdata.ts manually into this script for reliability.

const TRYOUT_DATA_SOURCE = [
    {
        id: "tryout-matematika-01",
        title: "Tryout UTBK - Matematika Dasar",
        subject: "Matematika",
        duration: 90,
        questions: [
            {
                id: 1,
                question:
                    "Diberikan bilangan bulat positif n sehingga n² + 3n + 5 adalah bilangan prima. Berapa jumlah semua nilai n yang memenuhi syarat tersebut?",
                options: ["1", "2", "3", "4"],
                correctAnswer: "2",
                points: 10,
            },
            {
                id: 2,
                question:
                    "Dalam segitiga ABC, AB = BC, dan sudut di A adalah 20°. Titik D terletak pada BC sehingga AD tegak lurus BC. Berapa nilai sudut BAD dalam derajat?",
                options: ["10", "20", "30", "40"],
                correctAnswer: "10",
                points: 10,
            },
            {
                id: 3,
                question:
                    "Berapa banyak bilangan bulat positif n sehingga n! + 1 adalah kuadrat sempurna?",
                options: ["3", "4", "5", "6"],
                correctAnswer: "3",
                points: 10,
            },
            {
                id: 4,
                question:
                    "Fungsi f(n) = n² + n + 41 menghasilkan bilangan prima untuk berapa banyak bilangan bulat n dengan |n| ≤ 100?",
                options: ["39", "40", "41", "42"],
                correctAnswer: "40",
                points: 10,
            },
            {
                id: 5,
                question:
                    "Sebuah lingkaran menyinggung sumbu-x di titik (3,0) dan melalui titik (0,2). Berapa panjang jari-jari lingkaran tersebut?",
                options: ["2", "√5", "3", "√10"],
                correctAnswer: "√10",
                points: 10,
            },
            {
                id: 6,
                question:
                    "Berapa banyak bilangan bulat positif n ≤ 100 sehingga 2ⁿ + 1 adalah bilangan prima?",
                options: ["4", "5", "6", "7"],
                correctAnswer: "5",
                points: 10,
            },
            {
                id: 7,
                question:
                    "Diberikan barisan a₁ = 1, aₙ₊₁ = aₙ + 1/aₙ untuk n ≥ 1. Berapa nilai ⌊a₁₀₀⌋?",
                options: ["10", "11", "12", "13"],
                correctAnswer: "11",
                points: 10,
            },
            {
                id: 8,
                question:
                    "Dalam sebuah lingkaran, tali busur AB dan CD sejajar, dan panjang AB adalah dua kali panjang CD. Jika sudut pusat ∠AOB = 60°, berapa sudut pusat ∠COD dalam derajat?",
                options: ["30", "60", "90", "120"],
                correctAnswer: "30",
                points: 10,
            },
            {
                id: 9,
                question:
                    "Berapa banyak pasangan bilangan bulat (x, y) yang memenuhi x² - y² = 100?",
                options: ["4", "6", "8", "10"],
                correctAnswer: "8",
                points: 10,
            },
            {
                id: 10,
                question:
                    "Jika p adalah bilangan prima sehingga p² + 2 adalah bilangan prima, berapa jumlah semua nilai p?",
                options: ["2", "5", "7", "10"],
                correctAnswer: "5",
                points: 10,
            },
        ],
    },
    {
        id: "tryout-fisika-01",
        title: "Tryout SBMPTN - Fisika",
        subject: "Fisika",
        duration: 90,
        questions: [
            {
                id: 1,
                question:
                    "Sebuah partikel bermuatan q = +2 μC bergerak dalam medan listrik homogen E = 500 N/C. Jika partikel berpindah sejauh 0,2 m searah medan, berapa perubahan energi potensial listriknya (dalam μJ)?",
                options: ["-100", "-200", "100", "200"],
                correctAnswer: "-200",
                points: 10,
            },
            {
                id: 2,
                question:
                    "Sebuah benda bermassa 2 kg diikat pada pegas dengan konstanta pegas 200 N/m. Jika benda digetarkan dengan amplitudo 0,1 m, berapa energi mekanik total sistem (dalam J)?",
                options: ["1", "2", "3", "4"],
                correctAnswer: "2",
                points: 10,
            },
            {
                id: 3,
                question:
                    "Sebuah satelit mengorbit bumi pada ketinggian R dari permukaan bumi (R adalah jari-jari bumi). Berapa rasio energi potensial gravitasi terhadap energi kinetik satelit?",
                options: ["-1", "-2", "1", "2"],
                correctAnswer: "-2",
                points: 10,
            },
            {
                id: 4,
                question:
                    "Sebuah kawat lurus panjang dialiri arus 5 A. Berapa besar medan magnet di titik yang berjarak 0,1 m dari kawat (μ₀ = 4π × 10⁻⁷ T·m/A)?",
                options: ["1 × 10⁻⁵ T", "2 × 10⁻⁵ T", "3 × 10⁻⁵ T", "4 × 10⁻⁵ T"],
                correctAnswer: "2 × 10⁻⁵ T",
                points: 10,
            },
            {
                id: 5,
                question:
                    "Sebuah gelombang transversal merambat pada tali dengan kecepatan 10 m/s. Jika frekuensi gelombang 5 Hz, berapa panjang gelombangnya (dalam m)?",
                options: ["0,5", "1", "2", "4"],
                correctAnswer: "2",
                points: 10,
            },
            {
                id: 6,
                question:
                    "Dua muatan titik q₁ = +3 μC dan q₂ = -2 μC terpisah sejauh 0,3 m. Berapa besar gaya Coulomb antara keduanya (k = 9 × 10⁹ N·m²/C²)?",
                options: ["20 N", "30 N", "40 N", "60 N"],
                correctAnswer: "60 N",
                points: 10,
            },
            {
                id: 7,
                question:
                    "Sebuah benda melakukan gerak harmonik sederhana dengan periode 2 s dan amplitudo 0,05 m. Berapa kecepatan maksimum benda (dalam m/s)?",
                options: ["0,05π", "0,1π", "0,2π", "0,5π"],
                correctAnswer: "0,05π",
                points: 10,
            },
            {
                id: 8,
                question:
                    "Sebuah foton memiliki energi 6,6 × 10⁻¹⁹ J. Berapa panjang gelombangnya (h = 6,6 × 10⁻³⁴ J·s, c = 3 × 10⁸ m/s) dalam nm?",
                options: ["300", "400", "500", "600"],
                correctAnswer: "300",
                points: 10,
            },
            {
                id: 9,
                question:
                    "Sebuah benda bermassa 1 kg jatuh bebas dari ketinggian 20 m di planet dengan percepatan gravitasi 5 m/s². Berapa energi kinetik benda saat menyentuh tanah (abaikan hambatan udara, dalam J)?",
                options: ["50", "100", "150", "200"],
                correctAnswer: "100",
                points: 10,
            },
            {
                id: 10,
                question:
                    "Sebuah rangkaian RLC seri memiliki R = 100 Ω, L = 0,1 H, dan C = 10 μF. Berapa frekuensi resonansi rangkaian (dalam Hz)?",
                options: ["159", "200", "250", "318"],
                correctAnswer: "159",
                points: 10,
            },
        ],
    },
    {
        id: "tryout-kimia-01",
        title: "Tryout UTBK - Kimia",
        subject: "Kimia",
        duration: 90,
        questions: [
            {
                id: 1,
                question:
                    "Berapa pH larutan 0,1 M asam asetat (Ka = 1,8 × 10⁻⁵) setelah dicampur dengan 0,05 M natrium asetat?",
                options: ["4,74", "5,74", "6,74", "7,74"],
                correctAnswer: "4,74",
                points: 10,
            },
            {
                id: 2,
                question:
                    "Reaksi redoks: 2MnO₄⁻ + 5C₂O₄²⁻ + 16H⁺ → 2Mn²⁺ + 10CO₂ + 8H₂O. Berapa koefisien H⁺ dalam reaksi setara?",
                options: ["8", "12", "16", "20"],
                correctAnswer: "16",
                points: 10,
            },
            {
                id: 3,
                question:
                    "Senyawa organik dengan rumus C₄H₈O bereaksi dengan NaBH₄ menghasilkan alkohol sekunder. Senyawa tersebut adalah...",
                options: ["Butanal", "Butanon", "Metil etil keton", "Siklobutanol"],
                correctAnswer: "Butanon",
                points: 10,
            },
            {
                id: 4,
                question:
                    "Berapa entalpi reaksi pembakaran metana (CH₄) jika ΔH_f° (CO₂) = -393,5 kJ/mol, ΔH_f° (H₂O) = -285,8 kJ/mol, dan ΔH_f° (CH₄) = -74,8 kJ/mol (dalam kJ/mol)?",
                options: ["-802,3", "-890,3", "-964,1", "-1002,5"],
                correctAnswer: "-890,3",
                points: 10,
            },
            {
                id: 5,
                question:
                    "Sebuah gas ideal menjalani proses isotermik pada 300 K. Jika tekanan berubah dari 2 atm menjadi 1 atm, berapa rasio volume akhir terhadap volume awal?",
                options: ["0,5", "1", "2", "4"],
                correctAnswer: "2",
                points: 10,
            },
            {
                id: 6,
                question: "Berapa jumlah isomer optik dari senyawa 2,3-diklorobutana?",
                options: ["1", "2", "3", "4"],
                correctAnswer: "2",
                points: 10,
            },
            {
                id: 7,
                question:
                    "Dalam sel elektrokimia dengan elektrode Zn|Zn²⁺ dan Cu|Cu²⁺, potensial standar sel adalah 1,10 V. Jika [Zn²⁺] = 0,1 M dan [Cu²⁺] = 1 M, berapa potensial sel pada 298 K?",
                options: ["1,07 V", "1,10 V", "1,13 V", "1,16 V"],
                correctAnswer: "1,07 V",
                points: 10,
            },
            {
                id: 8,
                question:
                    "Berapa massa molar senyawa jika 0,2 mol senyawa dalam 500 g air menghasilkan larutan dengan tekanan osmotik 4,92 atm pada 27°C (R = 0,082 L·atm/mol·K)?",
                options: ["40 g/mol", "60 g/mol", "80 g/mol", "100 g/mol"],
                correctAnswer: "60 g/mol",
                points: 10,
            },
            {
                id: 9,
                question:
                    "Senyawa koordinasi [Co(NH₃)₅Cl]Cl₂ memiliki bilangan oksidasi kobalt sebesar...",
                options: ["+1", "+2", "+3", "+4"],
                correctAnswer: "+3",
                points: 10,
            },
            {
                id: 10,
                question:
                    "Reaksi A + 2B → C memiliki hukum laju: rate = k[A][B]². Jika [A] digandakan dan [B] dikurangi setengah, berapa perubahan laju reaksi?",
                options: ["0,25 kali", "0,5 kali", "1 kali", "2 kali"],
                correctAnswer: "0,5 kali",
                points: 10,
            },
        ],
    },
];

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'lms_db',
        charset: 'utf8mb4',
    });

    try {
        console.log('Connected to database.');

        // Drop tables to force recreation with correct charset
        await connection.query('DROP TABLE IF EXISTS tryout_questions');
        await connection.query('DROP TABLE IF EXISTS tryouts');

        // 1. Create Tables
        await connection.query(`
      CREATE TABLE IF NOT EXISTS tryouts (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        duration INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);
        console.log('Table tryouts created/verified.');

        await connection.query(`
      CREATE TABLE IF NOT EXISTS tryout_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tryout_id VARCHAR(50),
        question TEXT NOT NULL,
        options JSON NOT NULL,
        correct_answer VARCHAR(255) NOT NULL,
        points INT DEFAULT 10,
        FOREIGN KEY (tryout_id) REFERENCES tryouts(id) ON DELETE CASCADE
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);
        console.log('Table tryout_questions created/verified.');

        // 2. Clear existing data to avoid duplicates during dev
        await connection.query('DELETE FROM tryout_questions');
        await connection.query('DELETE FROM tryouts');
        console.log('Cleared existing data.');

        // 3. Seed Data
        for (const tryout of TRYOUT_DATA_SOURCE) {
            await connection.query(
                'INSERT INTO tryouts (id, title, subject, duration) VALUES (?, ?, ?, ?)',
                [tryout.id, tryout.title, tryout.subject, tryout.duration]
            );

            for (const q of tryout.questions) {
                await connection.query(
                    'INSERT INTO tryout_questions (tryout_id, question, options, correct_answer, points) VALUES (?, ?, ?, ?, ?)',
                    [tryout.id, q.question, JSON.stringify(q.options), q.correctAnswer, q.points]
                );
            }
        }

        console.log('Migration and seeding completed successfully.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

migrate();
