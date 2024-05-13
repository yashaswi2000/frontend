

export default function EventTable({ events }) {
    return (
        <div>
        <div style={{ overflow: 'auto', maxHeight: '200px' }}>
      <table>
        <thead>
          <tr>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>{event.event.M.type.S ? event.event.M.type.S : 'No Type'}</td>
              <td>{event.event.M.score.S ? event.event.M.score.S : 'No Score'}</td>
              <td>{event.event.M.desc.S ? event.event.M.desc.S : 'No description'}</td>
            </tr>
          )).reverse()}
        </tbody>
      </table>
      </div>
    </div>

    );
  }