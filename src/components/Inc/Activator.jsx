import axios from 'axios';
import React, { useState } from 'react';
import { ButtonGroup } from 'react-bootstrap';
import useApi from '../Inc/Api';
import Swal from 'sweetalert2';

export default function Activator() {

    const [key, setKey] = useState('');
    const [domain, setDomain] = useState('');

    const [api] = useApi();

    const activate = e => {
        axios.put(`${api}/activator/1`, {
            key: key,
            domain: domain,
        })
            .then(res => {
                console.log(res)

                handleSuccessError(res);
            });
    }
    const handleSuccessError = res => {
        if (res.data.success) {
            Swal.fire({
                text: res.data.success,
                icon: 'success',
            });
        }
        if (res.data.error) {
            Swal.fire({
                text: res.data.error,
                icon: 'error',
            });
        }
    }

    return (
        <>
            <div className="row justify-content-center mt-5">
                <div className="col-md-8 d-flex justify-content-center">
                    <ButtonGroup>
                        <input onChange={e => setDomain(e.target.value)} className="form-control" placeholder="DOMAIN" />
                        <input onChange={e => setKey(e.target.value)} className="form-control" placeholder="KEY" />
                        <button onClick={activate} className="btn btn-success">Activate</button>
                    </ButtonGroup>
                </div>
            </div>
        </>
    )
}
