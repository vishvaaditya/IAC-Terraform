// Form.js

import React, { useState } from 'react';
import axios from 'axios';

function Form() {
  const [instanceType, setinstanceType] = useState('');
  const [instanceName, setinstanceName] = useState('');
  const [amiId, setamiId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/update-terraform', {
        instanceType,
        instanceName,
        amiId,
      });
      alert('Infrastructure provisioning request sent successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to send provisioning request.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={instanceType}
        onChange={(e) => setinstanceType(e.target.value)}
        placeholder="instanceType"
      />
      <input
        type="text"
        value={instanceName}
        onChange={(e) => setinstanceName(e.target.value)}
        placeholder="instanceName"
      />
      <input
        type="text"
        value={amiId}
        onChange={(e) => setamiId(e.target.value)}
        placeholder="amiId"
      />
      <button type="submit">Provision Infrastructure</button>
    </form>
  );
}

export default Form;
