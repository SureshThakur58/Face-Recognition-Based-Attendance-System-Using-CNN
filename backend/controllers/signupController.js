const bcrypt = require('bcryptjs');
const db = require('../models/db');

// Signup user
exports.signup = async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        // Check if the email is already registered
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const query = 'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)';
        await db.query(query, [fullname, email, hashedPassword]);

        res.status(201).json({
            message: 'User registered successfully',
            user: { fullname, email },
        });

    } catch (err) {
        console.error('❌ Error in signup:', err);
        res.status(500).json({ message: 'Database error', details: err.message });
    }
};
