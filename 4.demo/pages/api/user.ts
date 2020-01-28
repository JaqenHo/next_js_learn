import { NextApiRequest, NextApiResponse } from 'next';
import {UserRepository,NextUser} from '../../repositories/user-repository';

export default (req: NextApiRequest, res: NextApiResponse) => {
    try{
        switch (req.method.toUpperCase()) {
            case "GET":
                _get(req,res);
                break;
            case "POST":
                _post(req,res);
                break;
            default:
                res.status(404).send("");
                break;
        }
    } catch (e){
        //make some logs
        console.debug("error");
        console.debug(e);
        res.status(500).send("");
    }
};

async function _get(req: NextApiRequest, res: NextApiResponse){
    let userRepository = new UserRepository();
    let index = parseInt(req.query.index.toString());
    let pageSize =  parseInt(req.query.pageSize.toString());

    let pageData = await userRepository.getAllUser(index,pageSize)

    res.status(200).json({status:"ok",data:pageData});
}

async function _post(req: NextApiRequest, res: NextApiResponse){
    let userRepository = new UserRepository();
    let user:NextUser= req.body as NextUser;
    await userRepository.addUser(user);

    res.status(200).send({status:"ok"});
}