'use client';
import '../app/globals.css';
import UserProvider from "@/components/UserProvider";
import {AppProps} from "next/app";

const App = ({ Component, pageProps }: AppProps) => {

    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
};

export default App;