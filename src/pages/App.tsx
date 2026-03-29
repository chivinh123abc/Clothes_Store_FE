import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import Community from './Community/Community';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/:tabName" element={<Community />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;