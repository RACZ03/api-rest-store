
export const signUp = (req, res) => {

    const user =  req.body;
    return user;
} 

export const signIn = (req, res) => {
    res.json('SignIn');
}