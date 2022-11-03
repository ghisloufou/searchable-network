import { useState } from "react";
import { Panel } from "./newCode/Panel";
import { OldPanel } from "./oldCode/Panel";

export function Home() {
  const [isOldCodeDisplayed, setIsOldCodeDisplayed] = useState(false);

  return (
    <>
      <input
        checked={isOldCodeDisplayed}
        onChange={() => setIsOldCodeDisplayed((value) => !value)}
        type="checkbox"
      />
      {isOldCodeDisplayed ? <OldPanel /> : <Panel />}
    </>
  );
}
