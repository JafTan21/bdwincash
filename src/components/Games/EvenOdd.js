import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';
import Auth from '../Auth/Auth';
import useUser from '../Auth/useUser';
import useApi from '../Inc/Api';

export default function EvenOdd() {

    const [selected, setSelected] = useState('');
    const [amount, setAmount] = useState(0);
    const [rate, setRate] = useState(1);
    const [api] = useApi();
    const [user, setUser] = useUser();
    const [settings, setSettings] = useState([]);
    const fetchData = () => {
        axios.post(`${api}/get-game-settings`)
            .then(res => {
                setSettings(res.data.data);
            });
    }
    const [message, setMessage] = useState(<div></div>);
    const [playButtonDisabled, setPlayButtonDisabled] = useState(false);


    const images = {
        real: '/assets/evenodd.png',
        even: '/assets/even.png',
        odd: '/assets/odd.png',
        playing: '/assets/coin_toss.gif',
    };

    const [image, setImage] = useState(images.real);


    useEffect(() => {
        settings.forEach(setting => {
            if (setting.game_name == 'evenodd') {
                setRate(setting.rate);
            }
        });
    }, [settings]);

    useEffect(() => {
        if (Auth()) {
            if (selected == 'even') {
                document.getElementById('even').classList.add('selected-number');
                document.getElementById('odd').classList.remove('selected-number');
            }
            if (selected == 'odd') {
                document.getElementById('even').classList.remove('selected-number');
                document.getElementById('odd').classList.add('selected-number');
            }
        }
    }, [selected]);

    useEffect(() => {
        if (Auth()) {
            document.getElementById('win').innerHTML = parseFloat(amount ? amount : 0) * parseFloat(rate);
        }
    }, [amount]);

    useEffect(() => {
        fetchData();
    }, []);

    const play = () => {
        if (Auth()) {

            if (!amount || isNaN(amount)) {
                Swal.fire({
                    text: 'Please enter a valid amount',
                    icon: 'warning',
                });
                return;
            }

            if (selected == '') {
                Swal.fire({
                    text: 'Please select a valid option',
                    icon: 'warning',
                });
                return;
            }

            setImage(images.playing);
            setMessage(<div className="alert alert-warning text-center">
                Playing
            </div>);

            setPlayButtonDisabled(true);

            axios.post(`${api}/evenOdd`, {
                amount: amount,
                selected: selected,
                user_id: user.id,
            })
                .then(res => {
                    setTimeout(() => {
                        if (res.data.error) {
                            setMessage(<div className="alert alert-danger text-center">
                                {res.data.error}
                            </div>);


                            if (selected == 'even') setImage(images.odd);
                            if (selected == 'odd') setImage(images.even);
                        }

                        if (res.data.success) {
                            setMessage(<div className="alert alert-success text-center">
                                {res.data.success}
                            </div>);

                            if (selected == 'even') setImage(images.even);
                            if (selected == 'odd') setImage(images.odd);
                        }

                        if (res.data.played) {
                            setUser({
                                ...user,
                                balance: user.balance - amount +
                                    (res.data.success
                                        ? parseFloat(amount) * parseFloat(rate)
                                        : 0)
                            });
                        }

                        setPlayButtonDisabled(false);

                        if (!res.data.played) {
                            setImage(images.real);
                        }
                    }, 2500);
                });
        }
    }

    useEffect(() => {
        if (Auth()) {
            document.getElementById('user-balance').innerHTML = `$${user.balance}`;
            window.localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);



    if (!Auth()) {
        return <Redirect to="/login" />;
    }

    if (settings.some(setting => setting.game_name == 'evenodd' && !setting.status)) {
        return <Redirect to="/home" />
    }

    return (
        <>
            <div className="row justify-content-center px-0 py-5 m-0 game-container">
                <div className="col-12 col-md-6 p-0 m-0">
                    <div className="card game-card">
                        <h3 className="game-card-text m-3">Even-odd</h3>
                        <div className="card-body d-flex justify-content-center flex-column">
                            <img className="game-card-img" src={image} />

                            <div className="card mt-3" style={{ background: "rgb(204, 204, 204)" }}>
                                <div className="card-body">
                                    {message}
                                    <div className="row justify-content-center font-weight-bold">
                                        Select number
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col">
                                            <button onClick={() => setSelected('even')} className="btn btn-warning w-100" id="even">
                                                Even
                                            </button>
                                        </div>
                                        <div className="col">
                                            <button onClick={() => setSelected('odd')} className="btn btn-warning w-100" id="odd">
                                                Odd
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            <label>Amount</label>
                                            <input value={amount} onChange={e => setAmount(e.target.value)} className="form-control" placeholder="Enter amount:" />
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col">
                                            Possible win <b>({rate})</b>: <span id="win">0.00</span>
                                        </div>
                                    </div>
                                    <div className="row mt-3 justify-content-center">
                                        <button disabled={playButtonDisabled} onClick={play} className="btn btn-success play-button">Play</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
