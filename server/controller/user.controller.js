import User from "../model/user.model.js";
import bcrypt from "bcrypt";

// SIGN____________UP 
export const signup = async (req, res) => {
    try {
        const { name, userId, email, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { userId }] });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const hashPassword = await bcrypt.hash(password, 11);
        const createdUser = new User({
            name: name,
            userId: userId,
            email: email,
            password: hashPassword,
        });
        await createdUser.save();
        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: createdUser._id,
                userId: createdUser.userId,
                name: createdUser.name,
                email: createdUser.email,
            }
        });
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// LOG______________IN
export const login = async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(400).json({ message: "Invalid userId or password" });
            }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid userId or password" });
        }
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                userId: user.userId,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
