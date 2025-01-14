
import emailjs from '@emailjs/browser';
import config from './config';

const send = async(params:any) => {

    await emailjs
    .send(config.env.email.serviceId, 
      config.env.email.templateId,
      params,
      {
      publicKey: config.env.email.key,
      limitRate:{
          throttle:5000
      }
    })
  };

 const emailSender = async({name,email,message}:{name:string,email:string,message:string}) => {
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