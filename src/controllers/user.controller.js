import User from '../models/User';

export const index = async (req, res) => {

    const users = await User.find({});

    if ( !users ) return res.status(200).json({ users: [] })

    // response
    res.status(200).json({ users } );
}