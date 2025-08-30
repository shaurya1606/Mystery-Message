import { resend } from '@/lib/resend';
import VerificationEmail from "@/../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';

export default async function sendVerificationEmail(

    email: string,
    username: string,
    verifyCode: string

): Promise<ApiResponse>{
    try{

      await resend.emails.send({

      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Mystery message | Verification Code',
      react: VerificationEmail({ username: username, otp: verifyCode }),
      
    });

    console.log('Email sent successfully:', email);
    return {success: true, message: 'Verificcation email send successfully'}

    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return {success: false, message: 'Failed to send verificcation email'}
    }
}