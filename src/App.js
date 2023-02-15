import "./App.css";
import moment from "moment";
import { useState } from "react";
import EventBlock from "./EventBlock";

function App() {
  const events = [
    {
      start: "Wed, 03 Mar 2021 04:00:15 GMT",
      end: "Wed, 03 Mar 2021 05:00:15 GMT",
    },
    {
      start: "Wed, 03 Mar 2021 06:00:15 GMT",
      end: "Wed, 03 Mar 2021 06:30:15 GMT",
    },
    {
      start: "Wed, 03 Mar 2021 08:30:15 GMT",
      end: "Wed, 03 Mar 2021 09:30:15 GMT",
    },
    {
      start: "Wed, 03 Mar 2021 09:30:15 GMT",
      end: "Wed, 03 Mar 2021 09:50:15 GMT",
    },
    {
      start: "Wed, 03 Mar 2021 12:50:15 GMT",
      end: "Wed, 03 Mar 2021 13:10:15 GMT",
    },
    {
      start: "Wed, 03 Mar 2021 11:30:15 GMT",
      end: "Wed, 03 Mar 2021 12:15:15 GMT",
    },
    {
      start: "Wed, 03 Mar 2021 13:30:15 GMT",
      end: "Wed, 03 Mar 2021 14:00:15 GMT",
    },
    {
      start: "Wed, 03 Mar 2021 15:00:15 GMT",
      end: "Wed, 03 Mar 2021 15:30:15 GMT",
    },
  ];

  // Here I will be first calcuting all the free time between the given data set and store it to another array "AvailableSlots"
  // After that I will calculate the free time slots starting from "Start Time" in the form and show it to the UI

  const [startTime, setStartTime] = useState("");
  const [date, setDate] = useState("2021-03-03");
  const [duration, setDuration] = useState("");
  const [output, setOutput] = useState([]);

  const findSlots = () => {
    const n = events.length;
    const start = moment(events[0].start);
    const end = moment(events[n - 1].end);

    // Function to find all the gaps (Available time) having duration more than the input
    const findAvailableTimes = (start, end, duration, events) => {
      const availableSlots = [];

      // Parse date strings in events array into moment objects
      events.forEach((event) => {
        event.start = moment(event.start);
        event.end = moment(event.end);
      });

      // Sort events array based on start time
      events.sort((a, b) => a.start.diff(b.start));

      // Check for gaps between adjacent events and add new time slots
      for (let i = 0; i < events.length - 1; i++) {
        const currentEvent = events[i];
        const nextEvent = events[i + 1];
        const gap = moment.duration(nextEvent.start.diff(currentEvent.end));

        if (gap.asMinutes() >= duration) {
          availableSlots.push({
            start: currentEvent.end,
            end: nextEvent.start,
          });
        }
      }
      return availableSlots;
    };

    const AvailableSlots = findAvailableTimes(start, end, duration, events);

    // console.log("available", AvailableSlots);

    // Now taking the inputed start time into consideration and showing all available intervals

    // Merging both the date and time to create a moment using moment js
    let startMoment = moment(`${date}T${startTime}:00`, "YYYY-MM-DDTHH:mm:ss");

    // Here I am doing this to adjust the GMT time, because the "events" array and inputed time has different formats
    const myFormat1 = "YYYY-MM-DDTHH:mm:ss";
    startMoment = moment(startMoment, myFormat1).add({
      hours: 5,
      minutes: 30,
    });
    const myString = startMoment;
    const myFormat = "ddd, DD MMM YYYY HH:mm:ss [GMT]";
    const myMoment = moment.utc(myString).format(myFormat);
    console.log("myMoment :>> ", moment(myMoment));

    // Now just filtering out the Available intervals which are after the "start time"
    const slotsToShow = AvailableSlots.filter((item) => {
      if (moment(item.start).isAfter(myMoment)) {
        return moment.utc(item.start).format(myFormat);
      }
    });

    // console.log("slotsToShow", slotsToShow);

    // Merging both the busy and available slots/intervals to make the timeline
    // firstly merge busy intervals
    let finalOP = events.map((event) => {
      const start = moment.utc(event.start, "ddd, DD MMM YYYY HH:mm:ss [GMT]");
      const end = moment.utc(event.end, "ddd, DD MMM YYYY HH:mm:ss [GMT]");
      return {
        start: start.format(),
        end: end.format(),
        type: "busy",
      };
    });

    // then the available intervals
    slotsToShow.map((event) => {
      const start = moment.utc(event.start, "ddd, DD MMM YYYY HH:mm:ss [GMT]");
      const end = moment.utc(event.end, "ddd, DD MMM YYYY HH:mm:ss [GMT]");

      finalOP.push({
        start: start.format(),
        end: end.format(),
        type: "free",
      });
    });

    // sorting the timeline
    finalOP.sort((a, b) => {
      return moment(a.start).diff(moment(b.start));
    });

    // Finally removing all the busy intervals till the first free (availabe interval) is found
    for (let i = 0; i < finalOP.length - 1; ) {
      if (finalOP[i].type === "busy" && finalOP[i + 1].type === "busy")
        finalOP.shift();
      else if (finalOP[i + 1].type === "free") break;
    }

    // console.log(">>>>", finalOP);

    // setting the state
    setOutput(finalOP);
  };

  // Here the complete UI is created using React components, plain CSS, and Flexbox
  // all the CSS class code is present in App.css
  return (
    <div className="App">
      <div className="container">
        <div className="heading">FIND A FREE TIME</div>
        <div className="inputs">
          <span className="input">
            <label>Date</label>
            <br></br>
            <input
              type="date"
              onChange={(e) => setDate(e.target.value)}
              value={date}
            />
          </span>
          <span className="input">
            <label>Start Time</label>
            <br></br>
            <input
              type="time"
              onChange={(e) => setStartTime(e.target.value)}
              value={startTime}
            />
          </span>
          <span className="input">
            <label>Duration</label>
            <br></br>
            <input
              type="number"
              onChange={(e) => setDuration(e.target.value)}
              value={duration}
            />
          </span>
        </div>
        <div className="button-container">
          <button className="button" onClick={findSlots}>
            Find
          </button>
        </div>
        <div className="slots">
          {output.map((item) => {
            return (
              <EventBlock
                key={item.start}
                backgroundColor={item.type === "busy" ? "#c4c4c4" : "#1dee19"}
                start={item.start.substring(11, 16)}
                end={item.end.substring(11, 16)}
              />
            );
          })}
        </div>
        <div className="type">
          <div className="block"></div>
          Busy
          <div className="block"></div>
          Free
        </div>
      </div>
    </div>
  );
}

export default App;
