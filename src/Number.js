import React from 'react';
import './Number.css'

export default function Number({number, current, issued}) {

    let cn = "Number";
    
    cn += current ? ' current' : '';
    cn += issued ? ' issued' : '';

    return (<div className={cn}>
        <strong>{number}</strong>
    </div>)

};
