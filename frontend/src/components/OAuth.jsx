import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/feature/userSlice";

export default function OAuth() {
    const dispatch = useDispatch()
    const auth = getAuth(app);
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            // Sign in with Google
            const resultFromGoogle = await signInWithPopup(auth, provider)
            console.log(resultFromGoogle.user.photoURL);
            
            // Send user data to the server
            const response = await axios.post('https://scriptstorm-47.onrender.com/api/v1/auth/google', {
        name: resultFromGoogle.user.displayName,
        email: resultFromGoogle.user.email,
        googlePhotoUrl: resultFromGoogle.user.photoURL,
    },{withCredentials:true});

    if (response.status === 200) {
        dispatch(signInSuccess(response.data));
        navigate('/');
    }
} catch (error) {
    console.log(error);
}
    };

    return (
        <button 
            onClick={handleGoogleClick} 
            

            className="flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:bg-gradient-to-t hover:from-orange-500 hover:to-pink-500    disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <AiFillGoogleCircle className="w-6 h-6 mr-2" />
            Continue with Google
        </button>
    );
}   
