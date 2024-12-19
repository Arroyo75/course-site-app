import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if(userExists)
            return res.status(400).json({ success: false, message: "Email is already tied to an account"});

        const user = await User.create({ name, email, password });
        res.status(201).json({ success: true, message: "User registered successfully"});
    } catch (error) {
        res.status(400).json({ success: false, message: error.message});
    }
};

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ success: false, message: 'User not found' });

        const isCorrect = await bcrypt.compare(password, user.password);
        if(!isCorrect)
            return res.status(401).json({ success: false, message: "Wrong password"});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message});
    }
};