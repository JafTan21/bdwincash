import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ButtonGroup } from 'react-bootstrap';
import useApi from '../../Inc/Api';
import Swal from 'sweetalert2';

export default function OtherSetting() {

    const [settings, setSettings] = useState([]);
    const [api] = useApi();

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

    const toggleSetting = (setting) => {
        axios.put(`${api}/setting/${setting.id}`, {
            status: 'toggle',
        })
            .then(res => {
                handleSuccessError(res);
                fetchData();
            });
    }

    const saveSetting = (setting) => {
        var data = {
            min: document.getElementById(setting.name + "min").value,
            max: document.getElementById(setting.name + "max").value,
            time_limit: document.getElementById(setting.name + "time_limit").value,
        }
        axios.put(`${api}/setting/${setting.id}`, data)
            .then(res => {
                handleSuccessError(res);
                fetchData();
            });
    }

    const fetchData = () => {
        axios.post(`${api}/get-settings`)
            .then(res => {
                console.log(res);
                setSettings(res.data.settings);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div className="card">
            <div className="card-body">
                <h3 className="text-center">Other settings</h3>

                {
                    settings.map((setting, idx) => {
                        if (setting.name != 'min_balance') {
                            return <div key={idx} className="mt-3">

                                <h6 className="pr-3 d-inline">{setting.name}:</h6>

                                <ButtonGroup>
                                    {
                                        setting.status
                                            ? <button onClick={() => toggleSetting(setting)} className="btn btn-info btn-sm">
                                                On
                                            </button>
                                            : <button onClick={() => toggleSetting(setting)} className="btn btn-secondary btn-sm">
                                                Off
                                            </button>
                                    }
                                    <input id={setting.name + "min"} defaultValue={setting.min} className="form-control ml-3" placeholder="Minimum: " />
                                    <input id={setting.name + "max"} defaultValue={setting.max} className="form-control" placeholder="Maximum: " />
                                    <input type={setting.name == 'transfer' ? 'hidden' : 'number'} id={setting.name + "time_limit"} defaultValue={setting.time_limit} className="form-control" placeholder="Time limit: " />
                                    <button onClick={() => saveSetting(setting)} className="btn btn-success btn-sm">Save</button>
                                </ButtonGroup>
                            </div>
                        } else {
                            return <div key={idx} className="mt-3">

                                <h6 className="pr-3 d-inline">Min Balance:</h6>

                                <ButtonGroup>
                                    <input id={setting.name + "min"} defaultValue={setting.min} className="form-control ml-3" placeholder="Minimum: " />
                                    <input type="hidden" id={setting.name + "max"} defaultValue={setting.max} className="form-control" placeholder="Maximum: " />
                                    <input type="hidden" id={setting.name + "time_limit"} defaultValue={setting.time_limit} className="form-control" placeholder="Time limit: " />
                                    <button onClick={() => saveSetting(setting)} className="btn btn-success btn-sm">Save</button>
                                </ButtonGroup>
                            </div>
                        }
                    })
                }
            </div>
        </div>
    )
}
