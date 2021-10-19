import React, { Suspense } from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import AdminRoutePage from './components/Inc/AdminRoutePage';
import Nav from './components/Admin/Nav';
import Footer from './components/Admin/Footer';
import Sidebar from './components/Admin/Sidebar';


export default function Admin() {

    return (

        <Suspense>
            <BrowserRouter>
                <div className="wrapper">
                    <Nav />
                    <Sidebar />
                    <div className="content-wrapper">
                        <div className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col mt-3">
                                        <AdminRoutePage />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        </Suspense>
    )
}
