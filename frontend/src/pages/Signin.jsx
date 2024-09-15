import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInSuccess, signInStart } from "../redux/feature/userSlice";
import OAuth from "../components/OAuth";

function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    const { loading } = useSelector(state => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMessage('Please fill out all fields.');
            return;
        }

        dispatch(signInStart());

        try {
            const res = await axios.post('https://scriptstorm-47.onrender.com/api/v1/auth/signin', {
                username,
                password
            },{withCredentials:true});

            if (res.data.success) {
                dispatch(signInSuccess(res.data));
                navigate('/');
            } else {
                setErrorMessage('Unexpected response from server.');
            }
        } catch (err) {
            let errorMsg = 'An error occurred. Please try again.';

            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        errorMsg = 'Invalid username or password. Please check your credentials and try again.';
                        break;
                    case 401:
                        errorMsg = 'Unauthorized access. Please login again.';
                        break;
                    case 500:
                        errorMsg = 'Server error. Please try again later.';
                        break;
                    default:
                        errorMsg = err.response.data?.message || 'An unexpected error occurred.';
                        break;
                }
            } else if (err.request) {
                errorMsg = 'No response from server. Please check your internet connection and try again.';
            }

            setErrorMessage(errorMsg);
            dispatch(signInFailure(errorMsg));
        }
    };
   
    

    return (
        <div className="min-h-screen mt-20">
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
                <div className="flex-1">
                    <Link
                        to="/"
                        className="self-center whitespace-nowrap text-sm sm:text-lg font-semibold dark:text-white"
                    >
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            ScriptStorm
                        </span>
                    </Link>
                    <p className="text-sm mt-5">
                   {` Unlock your personalized dashboard and access all the exciting content you've missed. Whether it's exploring new blogs, interacting with stories, or sharing your thoughts, you're just a login away.`}
                    </p>
                </div>
                <div className="flex-1 h-full">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 rounded w-full max-w-sm mx-auto">
                        <div className="flex flex-col">
                            <label htmlFor="username" className="text-sm font-medium text-gray-700">Your Username:</label>
                            <input
                                onChange={(e) => setUsername(e.target.value.trim())}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="username"
                                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">Your Password:</label>
                            <input
                                onChange={(e) => setPassword(e.target.value.trim())}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="password"
                                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {errorMessage && (
                        <div className="text-red-500 font-medium rounded-md">
                            {errorMessage}
                        </div>
                    )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                      
                    </form>
                    <div className="flex flex-col px-4 rounded w-full max-w-sm mx-auto">
                        <OAuth />
                    </div>
                    <div className="flex gap-2 text-sm mx-6 mt-4">
                        <span>{`Don't Have an account?`}</span>
                        <Link to='/sign-up' className="text-blue-500">Sign Up</Link>
                    </div>
                   
                </div>
            </div>
        </div>
    );
}

export default Signin;




