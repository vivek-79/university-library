import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { serve } from "@upstash/workflow/nextjs"
import { eq } from "drizzle-orm";
import emailjs from '@emailjs/browser';
import config from "@/lib/config";

const send = async(params:any) => {

  try {
    console.log("Sending email with params:", params);
    await emailjs.send(
      config.env.email.serviceId,
      config.env.email.templateId,
      params,
      config.env.email.key
    );
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
  };

 const emailSender = async({name,email,message}:{name:string,email:string,message:string}) => {
    
  if (!name || !email || !message) {
    throw new Error("Invalid email parameters");
  }
  console.log('creating email with params :',name,email,message)
  const templateParams = {
        to_name:name,
        from_name:"University Library",
        reply_to:"university@library",
        to_email:email,
        message:message

    }
    await send(templateParams)
};


type UserState = 'non-active' | 'active'

type InitialData = {
  email: string;
  fullName:string;
}

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS =  3 * ONE_DAY_IN_MS;
const ONE_MONTH_IN_MS = 30 * ONE_DAY_IN_MS;


const getUserState = async (email:string): Promise<UserState> => {
  const user = await db.select()
      .from(users)
      .where(eq(users.email,email))
      .limit(1);

    if(user.length === 0) return "non-active";

    const lastActivityDate = new Date(user[0].lastActivityDate!);
    const now = new Date();

    const timeDifference = now.getTime() - lastActivityDate.getTime();

    if(timeDifference>THREE_DAYS_IN_MS && timeDifference <ONE_MONTH_IN_MS){

      return "non-active"
    }

    return "active"
}

export const { POST } = serve<InitialData>(async (context) => {
  const { email,fullName } = context.requestPayload

  // welcome email

  console.log('welcome message sending as email with params',fullName,email)
  await context.run("new-signup", async () => {
    await emailSender({
      email,message:"Welcome to the platform",name:fullName
    })
  })

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3)

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email)
    })

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await emailSender( {email,message:'Hey are u there!.  we miss You', name:fullName} )
      })
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await emailSender( {email,message:'Welcome Back!.', name:fullName} )
      })
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30)
  }
});

