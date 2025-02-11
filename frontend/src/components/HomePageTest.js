import React from "react";
import { Link } from "react-router-dom";

const HomePageTest = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const username = storedUser ? storedUser.name : null; 

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            {username ? (
                <>
                    <h1 className="text-3xl font-bold mb-4">Welcome, {username}!</h1>
                    <p className="text-lg mb-6">You are successfully logged in.</p>
                    <Link to="/logout" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                        Logout
                    </Link>
                    
                </>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-4">Welcome to Our Booking System</h1>
                    <p className="text-lg mb-6">Register now to book your perfect stay!</p>
                    <Link to="/register" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                        Register
                    </Link>
                    <br />
                    <Link to="/login" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                        Login
                    </Link>
                </>
            )}
        </div>
    );
};

export default HomePageTest;
