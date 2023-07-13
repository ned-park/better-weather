import * as uniqId from 'uniqid';

const humanReadable = new Map<string, string>();
humanReadable.set("time", "Time");
humanReadable.set("temperature_2m", "T");
humanReadable.set("relativehumidity_2m", "RH");
humanReadable.set("precipitation_probability", "PoP");
humanReadable.set("precipitation", "H20");
humanReadable.set("weathercode", "Type");
humanReadable.set("windspeed_10m", "Wind");

function WeatherTable({
  tableData,
  tableHeaders,
  tableUnits,
  location
}: {
  tableData: Array<number[] | string[]>,
  tableHeaders: Array<string>,
  tableUnits: Array<string>,
  location: string
}) {

  return (
    <table
      className="w-full table-auto text-center text-tableclamp"
    >
      <thead>
        <tr className="bg-Slate-400"><th colSpan={100}>Hourly Weather Forecast for {location}</th></tr>
        <tr className="bg-slate-400">{tableHeaders
          .map((heading: string) =>
            <th
              key={uniqId.default()}
              className="first-of-type:px-1 px-1">
              {(humanReadable.has(heading) ? humanReadable.get(heading) : heading)}
            </th>)}
        </tr>
        <tr className="bg-slate-400">
          {Object.values(tableUnits).map((unit: string) =>
            <th
              key={uniqId.default()}
              className="first-of-type:px-1 px-1">
              {unit}
            </th>)}
        </tr>

      </thead>
      <tbody className="pl-4">
        {tableData?.map((row) => {
          return (
            <tr
              className="even:bg-slate-400 odd:bg-slate-200"
              key={uniqId.default()}
            >
              {row.map((value, i) =>
                <td
                  key={uniqId.default()}
                  className="first-of-type:px-1 px-1"
                >
                  {i === 0 ? String(value).split("T")[1] : value}
                </td>)}
            </tr>
          )
        })
        }
      </tbody>
    </table>
  );
}

export default WeatherTable;