import * as uniqId from 'uniqid';
import { Noto_Color_Emoji } from 'next/font/google'

const emoji = Noto_Color_Emoji({ 
  weight: "400",
  subsets: ['emoji'],
});

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
      className="w-full table-auto text-center text-tableclamp border-2 border-b-0 border-grey"
    >
      <thead  className="border-b-2 border-grey">
        <tr><th colSpan={100}>Hourly Weather Forecast for {location}</th></tr>
        <tr>{tableHeaders
          .map((heading: string) =>
            <th
              key={uniqId.default()}
              className="first-of-type:px-1 px-1">
              {(humanReadable.has(heading) ? humanReadable.get(heading) : heading)}
            </th>)}
        </tr>
        <tr>
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
              className="border-b-2 border-grey"
              key={uniqId.default()}
            >
              {row.map((value, i) =>
                <td
                  key={uniqId.default()}
                  className={`first-of-type:px-1 px-1 ${i===1? emoji.className: "" }`}
                >
                  {i === 0 ? 
                  String(value).split("T")[1] 
                  : value}
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