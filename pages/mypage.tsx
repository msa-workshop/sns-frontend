import React, {useState} from "react";
import MyPage from "@/components/MyPage";

const MyPagePage = () => {
    const [user, setUser] = useState(null);

    return (
        <div>
            <MyPage/>
        </div>
    );
};

export default MyPagePage;