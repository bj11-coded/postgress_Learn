import usersService from "./users.service.js";

const createUserController = async(req, res) =>{
    try {
        const newUser = await usersService.createUserService(req.body)
        if (!newUser) res.status(400).json({
            success: false,
            message: "User not created"
        })

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllUserController = async(req, res) =>{
    try {
        const users = await usersService.getAllUserService()
        if (!users) res.status(404).json({
            success:false,
            message: "Users not found"
        })

        res.status(200).json({
            success:true,
            message: "Users fetched successfully",
            data: users
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

export default{
    createUserController,
    getAllUserController
}


