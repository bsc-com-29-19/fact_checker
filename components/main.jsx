
// components/main.jsx
import React from "react";
import Button  from "@/components/button";

const FactCheckComponent = ({
  claim,
  trueStatement,
  falseStatement,
  wholeTruth,
}) => {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <strong>Claim:</strong> {claim}
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
          Claim Decomposition:
        </h2>
        <p>
          <strong>True:</strong> {trueStatement}
        </p>
        <p>
          <strong>False:</strong> {falseStatement}
        </p>
      </div>
      <div>
        <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Whole Truth:</h2>
        <p>{wholeTruth}</p>
      </div>
      {/* button for sources will be here */}
      <div>
        <Button variant="primary">View Sources</Button>
      </div>
    </div>
  );
};

export default FactCheckComponent;
