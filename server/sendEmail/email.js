
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE  , WELCOME_EMAIL} from "./emailTemplates.js"
import {sendEmail} from "./nodemailer.js";


export const sendVerificationEmail=async (email,verificationToken)=>{
    console.log(verificationToken);
  
   
    try{
       
        await sendEmail(
            email,
            "Verify your email",
            VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken)
        );

    }
    catch(error){
        console.log(`Error sending verification`,error);
        throw new Error(`Error sending verification email:${error}`)
    }
}


export const sendWelcomeEmail=async (email,name)=> {
    
    try{
        await sendEmail(
            email,
            "Welcome to our platform",
            WELCOME_EMAIL.replace("{userName}", name)
          );
    }
    catch(error){
        console.log(`Error sending welcome email`,error);
        throw new Error(`Error sending welcome email:${error}`);

    }
}

export const sendPasswordResetEmail=async(email,resetURL)=>{
    console.log(resetURL);
   
    try{
       await sendEmail(
          
            email,
            "Reset your password",
            PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
        )
    }
    catch(error){
        console.log("Error sending password reset email",error);
        throw new Error(`Error sending password reset email:${error}`)
    }
}


export const sendResetSuccessEmail=async(email)=>{
    // const recipient=[{email}];
    try{
        await sendEmail(
            email,
            "Password Reset Successful ",
            PASSWORD_RESET_SUCCESS_TEMPLATE
        )
    }
    catch(error){
        throw new Error(`Errro password reset successful email :${error}`)
    }

}
