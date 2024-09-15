'use client';

import React, { useState } from 'react';

const BulkSendAgreements = () => {
    const [recipients, setRecipients] = useState([{ name: '', email: '' }]);
    const [status, setStatus] = useState('');

    const handleInputChange = (index, event) => {
        const newRecipients = [...recipients];
        newRecipients[index][event.target.name] = event.target.value;
        setRecipients(newRecipients);
    };

    const addRecipient = () => {
        setRecipients([...recipients, { name: '', email: '' }]);
    };

    const sendBulkAgreements = async () => {
        const envelopeData = {
            emailSubject: 'Employment Agreement',
            recipients: {
                signers: recipients.map((recipient, index) => ({
                    email: recipient.email,
                    name: recipient.name,
                    recipientId: (index + 1).toString(),
                    routingOrder: '1',
                })),
            },
            status: 'sent',
        };

        try {
            const response = await fetch('https://demo.docusign.net/restapi/v2.1/envelopes', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer YOUR_ACCESS_TOKEN`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(envelopeData),
            });

            if (response.ok) {
                setStatus('Agreements sent successfully!');
            } else {
                throw new Error('Failed to send agreements.');
            }
        } catch (error) {
            console.error('Error sending agreements:', error);
            setStatus('Failed to send agreements.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Bulk Send Employment Agreements</h1>
            {recipients.map((recipient, index) => (
                <div key={index} className="flex space-x-4 mb-2">
                    <input
                        type="text"
                        name="name"
                        value={recipient.name}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder="Recipient Name"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="email"
                        name="email"
                        value={recipient.email}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder="Recipient Email"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
            ))}
            <button onClick={addRecipient} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Add Another Recipient
            </button>
            <button onClick={sendBulkAgreements} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Send Agreements
            </button>
            {status && <p className="mt-4 text-center text-lg">{status}</p>}
        </div>
    );
};

export default BulkSendAgreements;
