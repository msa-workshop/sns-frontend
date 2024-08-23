import React, {useState} from 'react';
import Post from '../components/Post'; // adjust this path according to the actual file location.

const PostPage = () => {
    const [user, setUser] = useState(null);

    return (
        <div>
            <Post/>
        </div>
    );
};

export default PostPage;