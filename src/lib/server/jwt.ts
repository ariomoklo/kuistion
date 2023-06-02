import { TOKEN_SECRET } from '$env/static/private'
import jwt from "jsonwebtoken"

const beingJahil = (str: string) => str.split('').reverse().join('') 

export function sign(data: string, secret: string | null = null) {
  if (!secret) secret = beingJahil(TOKEN_SECRET)
  else secret = beingJahil(TOKEN_SECRET+secret)
  return jwt.sign({ data }, secret, { expiresIn: getMaxAge() });
}

export function verify(token: string, secret: string | null = null) {
  if (!secret) secret = beingJahil(TOKEN_SECRET)
  else secret = beingJahil(TOKEN_SECRET+secret)
  try {
    return jwt.verify(token, secret) as jwt.JwtPayload;
  } catch(err) {
    return undefined
  }
}

export function getExpiredDate() {
  const today = new Date()
  return new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
}

export function getMaxAge() {
  return 60 * 60 * 24 * 365
}