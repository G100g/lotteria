import React, { Component } from "react";
import WheelEngine from "./WheelEngine";
import Events from "./Events";

export default class componentName extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error: false,
            people: [],
            events: []
        };

        this.onClickEvent = this.onClickEvent.bind(this);
    }

    loadingEvents() {
        return fetch(`${process.env.REACT_APP_MEETUP_API}/events`)
            .then(result => result.json())
            .then(events => {
                events.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                });
                return events;
            });
    }

    loadingCheckedInPeople(event) {
        const { id: eventId } = event;

        return fetch(
            `${process.env.REACT_APP_MEETUP_API}/checkedin/${eventId}`
        ).then(result => result.json());
    }

    actionLoadEvents() {
        this.setState({ events: [], people: [], loading: true }, () => {
            this.loadingEvents()
                .then(events => {
                    this.setState({ events, loading: false });
                })
                .catch(() => {
                    this.setState({ error: true, loading: false });
                });
        });
    }

    actionLoadPeople(event) {
        this.setState({ people: [], loading: true }, () => {
            this.loadingCheckedInPeople(event)
                .then(people => {
                    this.setState({ people, loading: false });
                })
                .catch(() => {
                    this.setState({ error: true, loading: false });
                });
        });
    }

    onClickEvent(event) {
        this.actionLoadPeople(event);
    }

    componentDidMount() {
        this.actionLoadEvents();
    }

    render() {
        const { error, loading, people, events } = this.state;

        return (
            <div>
                {error && <p>Error loading data.</p>}
                {loading && <p>loading data...</p>}

                {!loading && events.length > 0 && people.length === 0 ? (
                    <Events list={events} onClickEvent={this.onClickEvent} />
                ) : null}

                {!loading && people.length > 0 ? (
                    <WheelEngine people={people} />
                ) : null}
            </div>
        );
    }
}
