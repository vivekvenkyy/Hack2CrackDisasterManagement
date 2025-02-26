import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Realtime from './components/Realtime';
import TweetPrediction from './components/TweetPrediction';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/realtime" element={<Realtime />} />
                <Route path="/tweet-prediction" element={<TweetPrediction />} />
            </Routes>
        </Router>
    );
}

export default App;