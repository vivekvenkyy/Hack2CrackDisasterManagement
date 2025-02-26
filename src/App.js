import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DisasterPrediction from './components/DisasterPrediction';
import MentalHealth from './components/MentalHealth';
import RealTime from './components/Realtime';
import TweetPrediction from './components/TweetPrediction';

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/disaster-prediction" element={<DisasterPrediction />} />
                    <Route path="/mental-health" element={<MentalHealth />} />
                    <Route path="/realtime" element={<RealTime />} />
                    <Route path="/tweet-prediction" element={<TweetPrediction />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;