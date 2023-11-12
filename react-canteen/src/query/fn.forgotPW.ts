import axios from 'axios';
import { toast } from 'react-toastify';
import endpoints from '../utils/endpoints';
import { StatusCodes } from 'http-status-codes';

export const getOTPFn = async (email: string) => {
  try {
    const { status } = await axios.post(endpoints.otp.sendOTP, { email, otp:"", newPassword:"" });
    if (status === StatusCodes.NO_CONTENT) {
      toast.success('OTP has been sent successfully to your email.');
      return true;
    }
  } catch (error: any) {
    toast.error(error.message);
    return false;
  }
  toast.error('Sorry some problem occured.');
  return false;
};

export const checkOTPFn = async (email: string, otp: string) => {
    try {
      const { status } = await axios.post(endpoints.otp.checkOTP, { email, otp, newPassword:"" });
      if (status === StatusCodes.NO_CONTENT) {
        toast.success('OTP is valid. Continue..');
        return true;
      }
    } catch (error: any) {}
    toast.error('Invalid OTP, Try again.');
    return false;
  };

export const changePasswordOTPFn = async (email: string, otp: string, newPassword:string) => {
    try {
      const { status } = await axios.put(endpoints.otp.changePassword, { email, otp, newPassword });
      if (status === StatusCodes.NO_CONTENT) {
        toast.success('Password Changed successfully..');
        return true;
      }
    } catch (error: any) {}
    toast.error('OTP problem, Try again.');
    return false;
  };
