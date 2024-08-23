'use client';
import React, {useContext, useEffect, useState} from 'react';
import {Feed} from '@/types';
import {UserContext} from "@/UserContext";
import Link from "next/link";

interface TimelineProps {
    timelineId: string | string[] | undefined;
}

const Timeline: React.FC<TimelineProps> = ({timelineId}) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_TIMELINE_SERVER_API_BASE_URL || 'http://localhost:8080';
    const userBaseUrl = process.env.NEXT_PUBLIC_USER_SERVER_API_BASE_URL || 'http://localhost:9080';
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_SERVER_API_BASE_URL || 'http://localhost:6080';

    const [feeds, setFeeds] = useState<Feed[]>([]);
    const [popupVisible, setPopupVisible] = useState<{ [key: string]: boolean }>({});
    const {user} = useContext(UserContext);
    const togglePopup = (feedId: number) => {
        setPopupVisible(prev => ({...prev, [feedId]: !prev[feedId]}));
    };

    const handleFollow = async (): Promise<void> => {
        const response = await fetch(`${userBaseUrl}/api/follows/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: timelineId,
                followerId: user?.userId
            }),
        })

        if (response.ok) {
            setIsFollow(true);
        }
    };

    const handleUnfollow = async (): Promise<void> => {
        const response = await fetch(`${userBaseUrl}/api/follows/unfollow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: timelineId,
                followerId: user?.userId
            }),
        })

        if (response.ok) {
            setIsFollow(false);
        }
    };


    const clickLike = (feedId: number) => {
        if (user?.userId) {
            fetch(`${apiBaseUrl}/api/timeline/like/${feedId}/${user?.userId}`)
                .then((response) => response.json())
                .then((data) => {
                        const index = feeds.findIndex(feed => feed.feedId === feedId);
                        const updatedFeed = {...feeds[index], likes: data.likeCount};
                        let newFeeds = [...feeds];
                        newFeeds[index] = updatedFeed;
                        setFeeds(newFeeds);
                    }
                )
        }
    }

    const [isChecked, setIsChecked] = useState(true);
    const [isFollow, setIsFollow] = useState(true);
    const [timelineName, setTimelineName] = useState('');

    const toggleSwitch = () => {
        setIsChecked(!isChecked);
    }

    useEffect(() => {
        setFeeds([]);
        if (user?.userId) {
                setIsFollow(false);
                fetch(`${apiBaseUrl}/api/posts/user/${user?.userId}`)
                    .then((response) => response.json())
                    .then((data) => setFeeds(data))
                    .catch((error) => console.error('Error fetching data:', error));
        }
    }, [timelineId, user, isChecked]);

    return (
        <div className="space-y-4" style={{
            backgroundColor: '#eee',
            display: 'flex',  // added
            flexDirection: 'column',  // added
            justifyContent: 'flex-start',  // added
            alignItems: 'center',  // added
            margin: '60px auto 0 auto', // added top margin
            paddingTop: '20px',
            height: 'calc(100vh - 60px)', // adjust the height of the container
            overflowY: 'scroll',
        }}>
            {feeds.length == 0 && (
                <>
                    <div
                        className='text-gray-800'
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh', // adjust this according to your layout
                            fontSize: '3em', // adjust this to set the text size
                        }}>
                        <div>
                            <p>No Posts</p>
                        </div>
                    </div>

                </>
            )
            }
            
            {timelineId && timelineId != 'all' && timelineId != '' && feeds.length > 0 && timelineId != user?.userId && !isFollow && (
                <div style={{
                    position: 'fixed',
                    top: '100px',
                    right: '30px',
                }}>
                    <div>
                        <p className='text-gray-800 font-bold'>@{timelineName}</p>
                    </div>
                </div>
            )}
            {timelineId && timelineId != 'all' && timelineId != '' && feeds.length > 0 && isFollow && (
                <div style={{
                    position: 'fixed',
                    top: '100px',
                    right: '30px',
                }}>
                    <div>
                        <p className='text-gray-800 font-bold'>@{timelineName}</p>
                        {user?.userId && (
                            <p className='text-gray-600 cursor-pointer' onClick={handleUnfollow}>Unfollow User</p>
                        )}
                        <p className='text-orange-400' style={{cursor: 'pointer', fontSize: '15px', marginTop: '30px'}}>
                            {timelineId != '' && user?.userId && timelineId != user?.userId && (
                                <Link href={'/timeline/' + user?.userId}>Back to My Timeline</Link>)}
                        </p>
                    </div>
                </div>
            )}
            {feeds.map((feed) => (
                <div
                    style={{
                        width: '500px',
                    }}
                    key={feed.feedId} className="bg-white shadow-lg rounded-lg p-4">
                    {feed.imageId && (
                        <>
                            <img
                                src={`${imageBaseUrl}/api/images/view/${feed.imageId}?thumbnail=true`}
                                alt="Feed"
                                className="w-full h-auto"
                                draggable="false"
                                onClick={() => togglePopup(feed.feedId)}
                                style={{cursor: 'pointer'}}
                            />
                            {popupVisible[feed.feedId] && (
                                <div
                                    style={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        backdropFilter: 'blur(3px)',
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        padding: '20px',
                                        borderRadius: '10px',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    onClick={() => togglePopup(feed.feedId)}
                                >
                                    <img
                                        src={`${imageBaseUrl}/api/images/view/${feed.imageId}`}
                                        alt="Full Size Feed"
                                        style={{
                                            position: 'fixed',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 1000,
                                            maxWidth: 'calc(100vw - 200px)',
                                            maxHeight: 'calc(100vh - 200px)',
                                            display: 'block', margin: 'auto'
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                    <div className="text-sm text-black">{new Date(feed.uploadDatetime).toLocaleString()}</div>
                    <div className="text-sm text-black">{feed.uploaderName ?? "Unidentified User"}</div>
                    <div className="text-gray-500">{feed.contents}</div>
                    
                </div>
            ))}
        </div>
    );
};

export default Timeline;
