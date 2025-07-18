import {create} from "zustand";
import axios from "axios";

const API_URL=import.meta.env.MODE==="development"? "http://localhost:4000/api/auth": "/api/auth";

axios.defaults.withCredentials=true;

export const useAuthStore=create((set)=>({
    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,
    isCheckingAuth:true,
    message:null,

    signup:async (email , password , name)=>{
        set({isLoading:true ,error:null ,message:null});
        try{
           const response= await axios.post(`${API_URL}/signup`,{email ,password,name});
           console.log(response.data.message);
           set({user:response.data.user,isAuthenticated:false,isLoading:false,error:null ,message:response.data.message});
           
        }
        catch(error){
            console.log(error);
            set({
                error:
                  error.response?.data?.message || error.message || "An error occurred",
                  isLoading:false,
              });
            throw error;
        }
    },

    login:async(email,password)=>{
        set({isLoading:true ,error:null });
        try{
           const response= await axios.post(`${API_URL}/login`,{email ,password});
           set({user:response.data.user, isAuthenticated:true ,isLoading:false,error:null});
        }
        catch(error){
            set({
                error:
                  error.response?.data?.message || error.message || "Error logging in",
                isLoading: false,
              });
            throw error;

        }

    },


    logout:async()=>{
        set({isLoading:true, error:null});
        try {
            await axios.post(`${API_URL}/logout`);
            set({user:null ,isAuthenticated:false ,error:null,isLoading:false});
            
        } catch (error) {
            set({error:"Error logging out",isLoading:false});
            throw error;
            
        }
    },

    verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
       
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
            console.log("yupp");
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},

    checkAuth: async ()=>{
        set({isCheckingAuth:true,error:null});
        try {
            const response=await axios.get(`${API_URL}/check-auth`);
            set({user:response.data.user, isAuthenticated:true, isCheckingAuth:false});

            
        } catch (error) {
            set({error:null , isCheckingAuth:false , isAuthenticated:false});
            
        }
    },

    forgetPassword:async(email)=>{
        set({isLoading:true,error:null,message:null})
        try {
            const response=await axios.post(`${API_URL}/forget-password`,{email});
            set({message:response.data.message,isLoading:false});
            
        } catch (error) {
            set({isLoading:false, error:error.response.data.message || "Error sending reset password email"});
            throw error;
        }
    },
    resetPassword:async(token,password)=>{
        set({isLoading:true,error:null })
        try {
            const response=await axios.post(`${API_URL}/reset-password/${token}`,{token,password});
            set({message:response.data.message ,isLoading:false})
        } catch (error) {
            set({isLoading:false,error:error.message.data.message || "Error resetting password"});
            throw error;
            
        }

    }
    
}));