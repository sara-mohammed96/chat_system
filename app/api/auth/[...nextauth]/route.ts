import { connectMongoDB } from "../../../../lib/mongodb";
import User from '../../../../models/user'
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";

function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret= process.env.GOOGLE_CLIENT_SECRET

    if(!clientId || clientId.length ===0){
        throw new Error("Missing GOOGLE_CLIENT_ID");
    }

    if(!clientSecret || clientSecret.length === 0){
        throw new Error("Missing GOOGLE_CLIENT_SECRET")
    }

    return {
        clientId,
        clientSecret
    }
}   
const handler = NextAuth({
    pages:{
        signIn:"/login",
    },
    providers: [
        GoogleProvider({
          clientId: getGoogleCredentials().clientId,
          clientSecret:getGoogleCredentials().clientSecret,
        
        })
      ],
      callbacks: {
        async signIn({user, account}){
            console.log("User:", user);
            console.log("Account", account);

            if (account?.provider === 'google'){
                const { name, email } = user;
                try {
                    await connectMongoDB();
                    const userExists = await User.findOne({ email });
                    if (!userExists) {
                        const res = await fetch("http://localhost:3000/api/user", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            name,
                            email,
                          }),
                        });
                        if(res.ok) {
                            return user;
                        }
                }
            } catch(error) {
                console.log(error);
            }
        }
        return user;
      },
  
},
}
)
export { handler as GET, handler as POST };
