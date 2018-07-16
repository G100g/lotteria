import React from "react";

export default ({ list, onClickEvent }) => {
    return (
        <div className="events_container">
            <ul className="events_container__list">
                {list.map(event => (
                    <li
                        className="events_container__item"
                        key={event.id}
                        onClick={onClickEvent.bind(null, event)}
                    >
                        {event.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};
