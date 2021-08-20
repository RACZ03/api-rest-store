import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/User';
import Role from '../models/Role';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['token'];
        if ( !token ) return res.status(403).json({ message: 'No token provided' })
    
        const decoded = jwt.verify(token, config.SECRET);
        req.userId = decoded.id;
    
        const user = await User.findById( req.userId, { password: 0 } );
    
        if ( !user ) return res.status(404).json({ message: 'No user found'})
    
        next();
    } catch (error) {
        res.status(404).json({ message: 'No user found'})
    }
}

export const isAdminOrModerator = async ( req, res, next ) => {
    const user = await User.findById( req.userId );
    const role = await Role.findById( user.idRole );

    if ( role.name === 'admin' || role.name === 'moderator') {
        next();
        return;
    }
    
    return res.status(403).json({ message: 'Requires moderator or administrator role'});
};

export const isSuperAdmin = async ( req, res, next ) => {
    const user = await User.findById( req.userId );
    const role = await Role.findById( user.idRole );

    if ( role.name === 'admin') {
        next();
        return;
    }
    
    return res.status(403).json({ message: 'Requires administrator role'});
};