'use client';

import React, {useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {UserContext} from '@/UserContext';
import Link from "next/link";


const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useContext(UserContext);
    const router = useRouter(); // added this line
    const apiBaseUrl = process.env.NEXT_PUBLIC_USER_SERVER_API_BASE_URL || 'http://localhost:9080';

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch(`${apiBaseUrl}/api/users/signIn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                plainPassword: password,
            }),
        });

        if (response.ok) {
            const userData = await response.json();
            alert('Signed in successfully');
            login({
                userId: userData.userId,
                username: userData.username,
                email: userData.email,
            });
            router.push('/');

        } else {
            alert('Failed to sign in');
        }
    };

    return (
        <div style={{
            display: 'flex',
            backgroundColor: '#eee',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh' // This assumes that you want to center items on full viewport height
        }}>
            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '50%' // Adjust according to your requirement
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '500px', alignItems: 'flex-end'}}>
                    <div style={{display: 'flex', height: '60px', justifyContent: 'flex-end', width: '52%'}}>
                        <label className="text-gray-500" style={{fontSize: 50}}>
                            Username
                        </label>
                    </div>
                    <input className="text-gray-500 inputField" type="text" value={username}
                           onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div style={{
                    display: 'flex',
                    marginTop: '30px',
                    justifyContent: 'space-between',
                    width: '500px',
                    alignItems: 'flex-end'
                }}>
                    <div style={{display: 'flex', height: '60px', justifyContent: 'flex-end', width: '52%'}}>
                        <label className="text-gray-500" style={{fontSize: 50}}>
                            Password
                        </label>
                    </div>
                    <input className="text-gray-500 inputField" type="password" value={password}
                           onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button className="text-orange-500" style={{
                    borderBottom: '2px solid',
                    marginTop: '50px',
                    fontSize: 50,
                    height:'70px',
                    paddingBottom: '0px'
                }}
                        type="submit">Sign In
                </button>
            </form>
            <div style={{ marginTop: '20px'}}>
                <Link className="text-gray-800" href="/sign-up">
                    Don't have an account?
                    <span style={{
                        borderBottom: '2px solid',
                        marginLeft: '10px',
                        height:'30px',
                        paddingBottom: '0px'
                    }}>Sign-Up</span>
                </Link>
            </div>
        </div>
    );
};

export default SignIn;