import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DisasterPrediction from './components/DisasterPrediction';
import MentalHealth from './components/MentalHealth';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/disaster-prediction" element={<DisasterPrediction />} />
          <Route path="/mental-health" element={<MentalHealth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;