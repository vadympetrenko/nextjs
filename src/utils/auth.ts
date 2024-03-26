import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import Employee from "@/models/Employee";


export const authOptions: NextAuthOptions = {
    secret: process?.env?.NEXTAUTH_SECRET,
    pages: {
      signIn: "/login"
    },
    debug: process.env.NODE_ENV === 'development',
    providers: [
      CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "email", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
   
          async authorize(credentials, req) {
            await dbConnect()
            if( credentials?.password && credentials.email) {
              const admin = await Admin.findOne({email: credentials.email})
              if(admin) {
                  const isPassowrdCorrect = bcrypt.compareSync(credentials.password, admin.password)
                
                  if(isPassowrdCorrect) {
                    return admin
                  } 
                }
  
                const employee = await Employee.findOne({email: credentials?.email})
  
                if(employee) {
                  const isPassowrdCorrect = bcrypt.compareSync(credentials.password, employee.password)
                  if(isPassowrdCorrect) {
                    return employee
                  } 
                }
              } 
              
            return null
          }
        },
        ),
    ],
    session: {
      maxAge: 30 * 24 * 60 * 60, // 30 days,
    },
    callbacks: {
      async session({session, token}:any) {
        if (token) {
          return session = {
            name: token.name,
            role: token.role,
            id: token.id,
            email: token.email
          }
        }
        
        const user = await Admin.findOne({email: session?.user.email})
  
        if(user) {
          return session = {
            name: user.name,
            role: user.role,
            id: user._id,
            email: user.email
          }
        } 
  
        return session
      },
      async jwt({token, user}:any) {
        if(user) {
  
          return  {
            ...token,
            role: user.role,
            name: user.name,
            id: user._id
          }
        }
        return token
      },
    }
  }
