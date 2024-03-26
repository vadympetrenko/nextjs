
import { JWT } from "next-auth/jwt"
import {Session} from 'next-auth/session'

import NextAuth from "next-auth"
import { Role } from "./types"

declare module "next-auth" {
  interface Session {
    id: string,
    role: Role  | SidebarAdmin,
    name: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string,
    sub: string,
    iat: number,
    exp: number,
    jti: string
  }

}

