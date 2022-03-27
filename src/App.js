import React, { Component } from "react";
import WheelEngine from "./WheelEngine";
import Events from "./Events";

export default class componentName extends Component {
    constructor(props) {
        super(props);

        const textareaValue = window.localStorage.getItem("people") || "";
        console.log(textareaValue);
        this.state = {
            loading: true,
            error: false,
            people: [],
            textareaValue,
            showWheel: false,
        };

        this.onClickEvent = this.onClickEvent.bind(this);
    }

    // loadingEvents() {
    //     return fetch(`${process.env.REACT_APP_MEETUP_API}/events`)
    //         .then((result) => result.json())
    //         .then((events) => {
    //             events.sort((a, b) => {
    //                 return new Date(b.date) - new Date(a.date);
    //             });
    //             return events;
    //         });
    // }

    // loadingCheckedInPeople(event) {
    //     const { id: eventId } = event;

    //     return fetch(
    //         `${process.env.REACT_APP_MEETUP_API}/checkedin/${eventId}`
    //     ).then((result) => result.json());
    // }

    // actionLoadEvents() {
    //     this.setState({ events: [], people: [], loading: true }, () => {
    //         this.loadingEvents()
    //             .then((events) => {
    //                 this.setState({ events, loading: false });
    //             })
    //             .catch(() => {
    //                 this.setState({ error: true, loading: false });
    //             });
    //     });
    // }

    // actionLoadPeople(event) {
    //     this.setState({ people: [], loading: true }, () => {
    //         this.loadingCheckedInPeople(event)
    //             .then((people) => {
    //                 this.setState({ people, loading: false });
    //             })
    //             .catch(() => {
    //                 this.setState({ error: true, loading: false });
    //             });
    //     });
    // }

    onClickEvent(event) {
        this.actionLoadPeople(event);
    }

    savePartecipants() {
        const people = this.state.textareaValue
            .split("\n")
            .filter(Boolean)
            .map((name) => ({ name }));

        window.localStorage.setItem("people", this.state.textareaValue);

        this.setState({ showWheel: true, people });
    }

    onChangePartecipants(textarea) {
        this.setState({ textareaValue: textarea.value });
    }

    // componentDidMount() {
    //     this.actionLoadEvents();
    // }

    render() {
        const { people, showWheel, textareaValue } = this.state;
        console.log(people);
        return (
            <div>
                {!showWheel ? (
                    <div className="partecipants">
                        <textarea
                            onChange={(e) =>
                                this.onChangePartecipants(e.target)
                            }
                            value={textareaValue}
                            placeholder="Enter player names"
                        ></textarea>
                        <button
                            type="button"
                            onClick={() => this.savePartecipants()}
                            disabled={textareaValue.length === 0}
                        >
                            Start
                        </button>
                    </div>
                ) : null}
                {showWheel && people.length > 0 ? (
                    <WheelEngine people={people} />
                ) : null}
            </div>
        );
    }
}
