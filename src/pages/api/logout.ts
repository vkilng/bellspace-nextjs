import { NextApiRequest, NextApiResponse } from 'next';
import { removeTokenCookie } from '@/lib/auth-cookies'

export default async function logout(req:NextApiRequest, res:NextApiResponse) {
  removeTokenCookie(res);
  res.redirect(302,'/');
}