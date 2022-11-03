import React, { useState } from "react";
import { NetworkData } from "./NetworkData";
import { NetworkDetails } from "./NetworkDetails";
import "./Panel.scss";

export function Panel() {
  return (
    <div>
      <NetworkData />

      <NetworkDetails />
    </div>
  );
}
