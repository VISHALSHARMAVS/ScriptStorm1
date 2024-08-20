import { Link } from "react-router-dom";
import { BsFacebook, BsTwitter, BsLinkedin, BsGithub } from "react-icons/bs";

function Footer() {
    return (
        <footer className="border-t-2 border-teal-500 py-2 bg-gray-100">
            <div className="w-full max-w-7xl mx-auto px-4">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                    <div className="mt-5">
                        <Link
                            to="/"
                            className="text-lg sm:text-xl font-semibold text-teal-700 dark:text-white"
                        >
                            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                                ScriptStorm
                            </span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                        <div>
                            <h3 className="text-xl font-semibold text-teal-600">About</h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <Link to="/" className="text-teal-500 hover:underline">
                                        ScriptStorm
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="text-teal-500 hover:underline">
                                        About Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-teal-600">Follow Us</h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <a href="https://www.github.com/VISHALSHARMAVS" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.instagram.com/__vishal.sharma047__" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.linkedin.com/in/vishal-sharma047/" target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">
                                        LinkedIn
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-teal-600">Legal</h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <a href="/privacy-policy" className="text-teal-500 hover:underline">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="/terms-of-service" className="text-teal-500 hover:underline">
                                        Terms of Service
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-4 flex flex-col items-center">
                    <p className="text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} ScriptStorm. All rights reserved.
                    </p>
                    <div className="flex gap-6 mt-4">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                            <BsFacebook size={24} />
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                            <BsTwitter size={24} />
                        </a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                            <BsLinkedin size={24} />
                        </a>
                        <a href="https://www.github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                            <BsGithub size={24} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
