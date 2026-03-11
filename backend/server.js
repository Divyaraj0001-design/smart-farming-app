const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

const JWT_SECRET = 'agromind-super-secret-key-123!!'

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'database.sqlite')
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection error:', err.message)
    else console.log('Connected to SQLite database.')
})

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`)

// --- Routes ---

// Register New User
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' })
    }

    try {
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10)

        const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`
        db.run(sql, [name, email, hashedPassword], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email already exists' })
                }
                return res.status(500).json({ error: 'Failed to create user' })
            }

            // Auto login after register
            const token = jwt.sign({ id: this.lastID, name, email }, JWT_SECRET, { expiresIn: '7d' })
            res.status(201).json({ message: 'User created successfully', token, user: { name, email } })
        })
    } catch (err) {
        res.status(500).json({ error: 'Server error during registration' })
    }
})

// Login User
app.post('/api/login', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter both email and password' })
    }

    const sql = `SELECT * FROM users WHERE email = ?`
    db.get(sql, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' })
        if (!user) return res.status(400).json({ error: 'Invalid email or password' })

        // Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' })

        // Generate token
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
        res.json({ message: 'Login successful', token, user: { name: user.name, email: user.email } })
    })
})

const PORT = 5050
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`))
