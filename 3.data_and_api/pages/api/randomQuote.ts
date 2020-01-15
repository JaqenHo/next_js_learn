import { NextApiRequest, NextApiResponse } from 'next';


export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
      param:req.query.param,
      quote: 'Write tests, not too many, mostly integration',
      author: 'Kun'
    });
  };
