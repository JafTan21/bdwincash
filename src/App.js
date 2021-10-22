import React, { useEffect, useState, lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import useUser from './components/Auth/useUser';
import useApi from './components/Inc/Api';
import Auth from './components/Auth/Auth';
import axios from 'axios';
import Admin from './Admin';
import User from './User';
import Activator from './components/Inc/Activator';



const Loading = () => {
    return <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '60px',
        position: 'absolute',
        zIndex: '9999',
        left: '0',
        right: '0',
        margin: '100px',
    }}>
        <div className="spinner-border p-2 m-auto bg-transparent text-success" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>;
}

export default function App() {

    const [api] = useApi();

    const [user, setUser] = useUser();
    const [siteActivated, setSiteActivated] = useState('1');
    const [isAdmin, setIsAdmin] = useState(
        (Auth() && user.roles) ?
            user.roles.some(role => role.name == 'Admin') :
            false
    );
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {


        axios.post(`${api}/check-security-key`, {
            domain: window.location.host
        })
            .then(res => {
                setSiteActivated(res.data.activated);
                console.log(res)
                setLoaded(true);
            });

        if (window.localStorage.getItem('user')) {
            axios.post(`${api}/get-user`, {
                user_id: JSON.parse(window.localStorage.getItem('user')).id,
            })
                .then(res => {
                    window.localStorage.setItem('user',
                        JSON.stringify(res.data.user)
                    );
                    setUser(res.data.user);
                });
        }
    }, []);

    useEffect(() => {
        if (Auth() && !isAdmin && document.getElementById('user-balance')) {

            document.getElementById('user-balance').innerHTML = `$${user.balance}`;
        }
    }, [user]);

    if (!loaded) {
        return <Loading />
    }

    if (siteActivated == '0') {
        return <Activator />
    }

    return (
        isAdmin
            ? <Admin />
            : <User />
    );
}