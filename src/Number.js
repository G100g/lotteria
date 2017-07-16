import React from 'react';
import './Number.css'

export default function Number({pos, wheelNumbers, offset, className}) {

    // const colors = ['red', 'blue', 'green', 'yellow', 'tomato'] ;
    const colors = ['#E500C8', '#A203E7', '#4406EA', '#0A2CEC', '#0D90EF', '#',
     '#4406EA',
      '#11F2F0',
       '#11F2F0',
        '#14F494',
         '#18F738',
          '#5AF91C',
           '#BBFC20',
            '#FFE224',
            ] ;
    





    let cn = `Number ${className || ''}`;
    
    // cn += current ? ' current' : '';
    // cn += issued ? ' issued' : '';

    let currentPosition = pos + offset;
    // if (currentPosition > wheelNumbers.length) {

    const styleObject = {
        backgroundColor: colors[currentPosition % colors.length] 
    };

    // }
    const number = wheelNumbers[currentPosition];

    return (<div className={cn} style={styleObject}>
        <strong>{number}</strong>
    </div>)

};
