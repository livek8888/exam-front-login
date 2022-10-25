// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  account: string;
  password: string;
};

export default function Handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let userData: Data = { account: "test", password: "Aasd123!" };

  if(req.method === 'POST' && req.body.account === userData.account && req.body.password === userData.password){
    res.json({ message : 'login sucsses!!' });
  }else{
    res.json({message : 'login fail!'})
  }
}
