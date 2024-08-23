import React, {useState} from 'react';
import SignIn from '../components/SignIn'; // adjust this path according to the actual file location.
import {UserContext} from '@/UserContext';
import UserProvider from "@/components/UserProvider";

const SignInPage = () => {
    const [user, setUser] = useState(null);

    return (
        <div>
            <SignIn/>
        </div>
    );
};

export default SignInPage;