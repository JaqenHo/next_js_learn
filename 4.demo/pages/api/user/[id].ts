import { NextApiRequest, NextApiResponse } from 'next';
import {UserRepository,NextUser} from '../../../repositories/user-repository';

export default (req: NextApiRequest, res: NextApiResponse) => {
    try{
        switch (req.method.toUpperCase()) {
            case "GET":
                _get(req,res);
                break;
            case "PUT":
                _put(req,res);
                break;
            case "DELETE":
                _delete(req,res);
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
    let id = parseInt(req.query.id.toString());
    let user = await userRepository.getUser(id);

    res.status(200).json({status:"ok",data:user});
}

async function _put(req: NextApiRequest, res: NextApiResponse){
    let userRepository = new UserRepository();
    let user:NextUser= req.body as NextUser;
    user.id = parseInt(req.query.id.toString());
    await userRepository.updateUser(user);

    res.status(200).send({status:"ok"});
}1

async function _delete(req: NextApiRequest, res: NextApiResponse){
    let userRepository = new UserRepository();
    await userRepository.deleteUser(parseInt(req.query.id.toString()));

    res.status(200).json({status:"ok"})
}
