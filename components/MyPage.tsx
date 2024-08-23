import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from '@/UserContext'; // Update with the actual path
import { useRouter } from 'next/router';

interface UserProfile {
    userId: number;
    username: string;
    email: string;
}

const MyPage: React.FC = () => {
    const { user, logout } = useContext(UserContext);
    const [followers, setFollowers] = useState<UserProfile[]>([]);
    const [followings, setFollowings] = useState<UserProfile[]>([]);
    const router = useRouter();
    const apiBaseUrl = process.env.NEXT_PUBLIC_USER_SERVER_API_BASE_URL || 'http://localhost:9080';
    const handleLogout = () => {
        logout();
        // You might want to navigate to a login or home page after logout
        router.push('/sign-in'); // Change to your login or home page path
    };

    const handleBackToTimeline = () => {
        router.back();
    };

    useEffect(() => {
        if (user) {
            fetch(`${apiBaseUrl}/api/follows/followers/${user.userId}`)
                .then(response => response.json())
                .then(data => setFollowers(data));

            fetch(`${apiBaseUrl}/api/follows/followings/${user.userId}`)
                .then(response => response.json())
                .then(data => setFollowings(data));
        }
    }, [user]);

    const navigateToTimeline = (userId: number) => {
        router.push(`/timeline/${userId}`);
    };

    const handleFollow = (fid: number) => {
        fetch(`${apiBaseUrl}/api/follows/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: fid,
                followerId: user?.userId
            }),
        }).then((response) => {
            if (response.ok) {
                const userProfile = followers.find(follower => follower.userId === fid);

                // If the user profile is not already in the followings list, add it
                if (userProfile && !followings.some(following => following.userId === fid)) {
                    setFollowings([...followings, userProfile]);
                }
            }
        })
    }

    const handleUnfollow = (fid: number) => {
       fetch(`${apiBaseUrl}/api/follows/unfollow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: fid,
                followerId: user?.userId
            }),
        }).then((response) => {
           if (response.ok) {
               const newFollowings = followings.filter(userProfile => userProfile.userId !== fid);
               setFollowings(newFollowings);
           }
        })
    }


    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '20px',
            fontSize: '20px',
            backgroundColor: '#eee',
            height: '100vh'
        }}>
            <h1 style={{alignSelf:'center', fontSize: '48px', color: '#333'}}>My Page</h1>
            {user && (
                <div style={{marginTop: '50px', marginBottom: '20px'}}>
                    <p className='text-gray-600' ><strong>Username:</strong> {user?.username}</p>
                    <p className='text-gray-600' ><strong>Email:</strong> {user?.email}</p>
                </div>
            )}
            <div style={{width: '100%', marginBottom: '20px'}}>
                <h2 className='font-bold' style={{fontSize: '30px', color: '#333'}}>My Followers</h2>
                {followers.map(follower => (
                    <p key={follower.userId}>
                    <span className='text-gray-600' key={follower.userId} onClick={() => navigateToTimeline(follower.userId)}
                       style={{cursor: 'pointer'}}>
                        {follower.username}
                    </span>
                        {!followings.find(following => following.userId === follower.userId) &&
                            <button className='text-orange-400' style={{'marginLeft': '15px', 'fontSize': '15px'}} onClick={(e) => {e.stopPropagation(); handleFollow(follower.userId)}}>Follow</button>
                        }
                    </p>

                ))}
            </div>
            <div style={{width: '100%', marginBottom: '20px'}}>
                <h2 className='font-bold' style={{fontSize: '30px', color: '#333'}}>I'm Following</h2>
                {followings.map(following => (
                    <p key={following.userId}>
                    <span className='text-gray-600' key={following.userId} onClick={() => navigateToTimeline(following.userId)} style={{ cursor: 'pointer' }}>
                        {following.username}
                        </span>
                        {
                            <button className='text-orange-400' style={{'marginLeft': '15px', 'fontSize': '15px'}} onClick={(e) => {e.stopPropagation(); handleUnfollow(following.userId)}}>Unfollow</button>
                        }
                    </p>
                ))}
            </div>
            <div className='text-red-500' onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Logout
            </div>
            <div className='text-gray-600' onClick={handleBackToTimeline} style={{ cursor: 'pointer' }}>
                Back to Timeline
            </div>
        </div>
    );
};

export default MyPage;
