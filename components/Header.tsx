'use client';

import React, {useContext, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {UserContext} from "@/UserContext";
import Link from "next/link";


const Header = () => {
    const router = useRouter(); // added this line
    const {user} = useContext(UserContext);

    const handleLoginClick = () => {
        router.push('/sign-in'); // navigate to the Sign-In page
    };

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1em',
            borderBottom: '1px solid #ddd',
            zIndex: 1000,
        }}>
            <Link href="/">
                <h1 style={{margin: 0, fontWeight: "lighter"}}>Project: Social Network</h1>
            </Link>
            {user?.username ? (
                <p>Hello, <Link href="/mypage">
                    {user?.username}
                </Link></p>
            ) : (
                <button onClick={handleLoginClick}>Sign-In</button>
            )}
        </header>
    );
};

export default Header;