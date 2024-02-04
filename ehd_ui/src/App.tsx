import { BrowserRouter } from "react-router-dom";
import Configuration from "./Admin/Configuration/configuration";
import { RoutingComponent } from "./Main/Routing";
import "./style.css";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <RoutingComponent />
      </BrowserRouter>
    </div>
  );
}

export default App;
