
export const signUp = (req, res) => {

    const user =  req.body;
    res.status(200).json(req.body);

} 

export const signIn = (req, res) => {
    res.status(204).json(req.body);
}