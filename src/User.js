import React, { Suspense } from 'react';
import Header from './components/Inc/Header';
import RoutePage from './components/Inc/RoutePage';
import Footer from './components/Inc/Footer';
import { BrowserRouter } from 'react-router-dom';



export default function User() {
    return (
        <BrowserRouter>
            <Header />
            <RoutePage />
            <Footer />
        </BrowserRouter>
    )
}
