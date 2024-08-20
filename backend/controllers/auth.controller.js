import User from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import errorHandler from '../utils/errorHandler.js'
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });

        if (!user) {
            return res.status(500).json({ message: 'User registration failed' });
        }
        const token = jwt.sign({
            id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        )
        const { password: pass, ...rest } = user._doc;

        res.status(200).cookie('token',token,{
            httpOnly:true,
        }).json({success:true, ...rest});

    } catch (error) {
        next(error);
    }
};
export const signIn = async(req,res,next)=>{
    const { username, password } = req.body;

    if (!username || !password) {
        return next(errorHandler(400, 'All fields are required'));
    }
    try {
        const validUser = await User.findOne({username})
        if (!validUser) {
           return next(errorHandler(404,'user not found'))
        }
        const validPassword = bcrypt.compareSync(password ,validUser.password)
        if (!validPassword) {
           return next(errorHandler(404,'Invalid Password'))
            
        }
        const token = jwt.sign({
            id:validUser._id,isAdmin:validUser.isAdmin},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        )
        const { password: pass, ...rest } = validUser._doc;
        res.status(200).cookie('token',token,{
            httpOnly:true,
        }).json({success:true, ...rest});
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            user = await User.create({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            });

            if (!user) {
                return res.status(400).json({ message: "User registration failed" });
            }
            const token = jwt.sign({ id: user._id ,isAdmin:user.isAdmin}, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc; 
        res.status(200).cookie('token', token, {
            httpOnly: true
        }).json(rest);
        }

        const token = jwt.sign({ id: user._id ,isAdmin:user.isAdmin}, process.env.JWT_SECRET);
        const { password, ...rest } = user._doc;
        res.status(200).cookie('token', token, {
            httpOnly: true
        }).json(rest);

    } catch (error) {
        next(error);
    }
};

