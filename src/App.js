import React, { Component } from "react";
import WheelEngine from "./WheelEngine";
export default class componentName extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      people: []
    };
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
    console.log(event);

    const { id: eventId } = event;

    return fetch(`${process.env.REACT_APP_MEETUP_API}/checkedin/${eventId}`)
      .then(result => result.json())
      // .then(people => {
        
      // });
    return [];
  }

  componentDidMount() {
    this.loadingEvents()
      .then(([event]) => {
        return this.loadingCheckedInPeople(event);
      })
      .then(people => {
        this.setState({ people, loading: false });
      })
      .catch(() => {
        this.setState({ error: true, loading: false });
      });
  }

  render() {
    const { error, loading, people } = this.state;

    return (
      <div>
        {error && <p>Error loading data.</p>}
        {loading && <p>loading data...</p>}
        {!loading && people.length > 0 ? <WheelEngine people={people} /> : null}
      </div>
    );
  }
}
