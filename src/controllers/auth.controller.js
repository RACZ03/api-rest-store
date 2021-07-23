
export const signUp = (req, res) => {

    const { email, password } =  req.body;
    console.log( req.body)
    res.json('SignUp');
} 

export const signIn = (req, res) => {
    res.json('SignIn');
}