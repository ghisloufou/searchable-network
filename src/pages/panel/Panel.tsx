import { FC } from "react";
import "@pages/panel/Panel.css";
import { Toolbar } from "./imports/Toolbar";

const Panel: FC = () => {
  return (
    <>
      <div className="container">
        <h1>Dev Tools Panel</h1>
      </div>

      <Toolbar />
    </>
  );
};

export default Panel;
