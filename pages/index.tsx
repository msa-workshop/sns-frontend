import Timeline from '../components/Timeline';
import Header from '../components/Header';
import {UserContext} from '../UserContext';
import {useContext, useEffect} from "react";
import UserProvider from "@/components/UserProvider";
import Link from "next/link";

const HomePage = () => {
    const {user} = useContext(UserContext);

    return (
        <div>
            <Header/>
            <Timeline timelineId={""}/>
            {user?.userId && <div
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#ff2222',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer'
                }}
            >
                <Link href="/post">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 5v14m7-7H5"
                            stroke="white"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
            </div>
            }
        </div>
    );
};

export default HomePage;