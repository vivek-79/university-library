
import emailjs from '@emailjs/browser';
import config from './config';

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

export default emailSender;