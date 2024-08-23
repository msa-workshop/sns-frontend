import {useContext, useState} from 'react';
import { useRouter } from 'next/router';
import {UserContext} from "@/UserContext";

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {login} = useContext(UserContext);
    const router = useRouter();
    const apiBaseUrl = process.env.NEXT_PUBLIC_USER_SERVER_API_BASE_URL || 'http://localhost:9080';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log(`${apiBaseUrl}/api/users`)
        try {
            const response = await fetch(`${apiBaseUrl}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    plainPassword: password,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }

            const signUpResult = await response.json()

            login({
                userId: signUpResult.userId,
                username: signUpResult.username,
                email: signUpResult.email,
            });

            // Redirect to sign-in page or wherever you want
            router.push('/timeline/'+signUpResult.userId);
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div style={{
            display: 'flex',
            backgroundColor: '#eee',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '50%'
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '500px', alignItems: 'flex-end'}}>
                    <div style={{display: 'flex', height: '60px', justifyContent: 'flex-end', width: '52%'}}>
                        <label className="text-gray-500" style={{fontSize: 50}}>
                            Username
                        </label>
                    </div>
                    <input
                        type="text"
                        className="text-gray-500 inputField"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
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
                            Email
                        </label>
                    </div>
                    <input
                        type="email"
                        className="text-gray-500 inputField"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
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
                    <input
                        type="password"
                        className="text-gray-500 inputField"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="text-orange-500" style={{
                    borderBottom: '2px solid',
                    marginTop: '50px',
                    fontSize: 50,
                    height: '70px',
                    paddingBottom: '0px'
                }}
                        type="submit">Sign Up
                </button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default SignUpPage;
