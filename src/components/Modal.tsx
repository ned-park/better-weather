import * as uniqId from 'uniqid';
import type { MouseEvent } from 'react';
import type{ LatLong,  Place} from '~/pages/weather';

function Modal({
  places,
  setLatLong,
  setShowModal,
  setLocation,
  setQuery,
}: {
  places: Place[],
  setLatLong: React.Dispatch<React.SetStateAction<LatLong>>,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  setLocation: React.Dispatch<React.SetStateAction<string>>,
  setQuery: React.Dispatch<React.SetStateAction<string>>,
}) {

  const handleSelection = (e: MouseEvent, place: Place) => {
    e.preventDefault();
    e.stopPropagation();
    setLatLong({
      latitude: String(place.latitude),
      longitude: String(place.longitude),
    });
    setLocation(place.name);
    setQuery("");
    setShowModal(false);
  }
  return (
        <section className="bg-sky-100 bg-opacity-80 min-w-full min-h-full flex justify-center items-center z-10">
    <div className="bg-sky-50 bg-opacity-100 shadow-lg p-2 md:p-16 h-200 z-50">
        <ul className="flex flex-col gap-1 md:gap-4 text-center overflow-visible overflow-auto z-50">
          {places.map((place: Place) => (
            <li
              key={uniqId.default()}
              onClick={(e) => handleSelection(e, place)}
              className="cursor-pointer border-b-2 grey"
            >
              {[place.name, place.admin1, place.country].filter((p: string) => p && p.length > 0).join(", ")}
            </li>))}
        </ul>
      </div>
    </section>
  )
}

export default Modal;
