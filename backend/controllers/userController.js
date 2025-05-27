const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;

    return jwt.sign({_id}, jwtkey,{expiresIn :"3d"});
}

const registerUser = async (req, res) =>{

    try{
        const {username, password, email} = req.body;
        let user = await userModel.findOne({ email });
        
        if(user) return res.status(400).json("User with the given email already exist ..")
            
        if(!username || !email || !password) 
            return res.status(400).json("All field are required..");
    
        if(!validator.isEmail(email)) 
            return res.status(400).json("Email must be a valid email ..");
    
        if(!validator.isStrongPassword(password)) 
            return res.status(400).json("Password must be a strong password. ");
    
            user = new userModel({username, email, password});
    
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
    
            await user.save();
    
            const token = createToken(user._id);
    
            res.status(200).json({_id :user._id, username, email, role: user.role, token});
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
    
};

const loginUser = async(req, res) =>{
    const {email, password} = req.body;

    try{
        let user = await userModel.findOne({ email });

        if(!user) 
            return res.status(400).json("Invalid email or password ..");

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) return res.status(400).json("Invalid email or password ...")
    
        const token = createToken(user._id);
        
        res.status(200).json({_id: user._id, username: user.username, email,role: user.role, token});
        }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

const findUser = async(req, res) =>{
    const userId = req.params.userId;
    try{
        const user = await userModel.findById(userId);
        
        res.status(200).json(user);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

const getUser = async(req, res) =>{
    
    try{
        const users = await userModel.find();
        
        res.status(200).json(users);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

const  updateUser = async(req, res) =>{
    const userId = req.params.userId;
    const {username, password, email} = req.body; // Data to update from the request body
    const updateData = {username, password, email};
    const user = await userModel.findById(userId);
    if(user.password != updateData.password){
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    try {
        const updatedUser  = await userModel.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
        if (updatedUser) {
            return res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
            });
        } else {
            return res.status(404).json({ message: "User  not found" });
        }
        } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal server error" });
        }
}

const deleteUser = async(req, res) =>
    {
        const userId = req.params.userId;
        try {
            const user = await userModel.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
                }
                return res.status(200).json({ message: "User deleted successfully" });
                } catch (error) {
                    console.error("Error deleting user:", error);
                    return res.status(500).json({ message: "Internal server error" });
                    }
}

module.exports = {registerUser, loginUser, findUser,getUser, updateUser,deleteUser};