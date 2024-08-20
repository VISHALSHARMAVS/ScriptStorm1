/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";

export default function ThemeProvider({children}) {

    const {theme} = useSelector(state => state.theme);
    return (
            <div className={theme}>
                <div className=" min-h-screen bg-white text-gray-700 dark:text-gray-400 dark:bg-[rgb(16,23,42)]">
                {children}
                </div>
            </div>
    )

}