import moment from "moment"
const EventBlock = ({ start, end, backgroundColor }) => {
  // here I am converting the 24 hr format to 12 hr for better readability
  const startTime = moment(start, 'HH:mm').format('h:mm A')
  const endTime = moment(end, 'HH:mm').format('h:mm A')
  return (
    <span className="event-block" style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
      height: '60px',
      width: '80px',
      border: "1px solid gray",
      borderRight: "none",
      backgroundColor,
      minWidth: "80px"
    }}><span>{startTime}</span><span style={{ margin: "-8px 0" }}>-</span><span>{endTime}</span></span>
  )
}

export default EventBlock