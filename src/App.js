import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DisasterPrediction from './components/DisasterPrediction';
import MentalHealth from './components/MentalHealth';
import TweetRealTime from './components/TweetRealTime';
import Realtime from './components/Realtime';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/disaster-prediction" element={<DisasterPrediction />} />
          <Route path="/mental-health" element={<MentalHealth />} />
          <Route path="/tweet-realtime" element={<TweetRealTime />} />
          <Route path="/realtime" element={<Realtime />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;