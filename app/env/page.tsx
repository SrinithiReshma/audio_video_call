import React from "react";

const TestEnv = () => {
  return (
    <div>
      <p>NEXT_PUBLIC_ADMIN_PASSKEY: {process.env.NEXT_PUBLIC_ADMIN_PASSKEY}</p>
    </div>
  );
};

export default TestEnv;
