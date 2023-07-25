import * as uniqId from 'uniqid';
import { Noto_Color_Emoji } from 'next/font/google'
import { humanReadable } from '~/utils/hashmaps';

const emoji = Noto_Color_Emoji({ 
  weight: "400",
  subsets: ['emoji'],
});

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