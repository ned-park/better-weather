import * as uniqId from 'uniqid';
import type { MouseEvent } from 'react';
import type{ LatLong,  Place} from '~/pages/weather';

function Modal({
  places,
  setLatLong,
  setShowModal,
  setLocation,
}: {
  places: Place[],
  setLatLong: React.Dispatch<React.SetStateAction<LatLong>>,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  setLocation: React.Dispatch<React.SetStateAction<string>>,
}) {

  const handleSelection = (e: MouseEvent, place: Place) => {
    e.preventDefault();
    setLatLong({
      latitude: String(place.latitude),
      longitude: String(place.longitude),
    });
    setLocation(place.name);
    setShowModal(false);
  }
  return (
    <section className="bg-sky-100 bg-opacity-80 fixed top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="bg-sky-50 bg-opacity-100 shadow-lg p-16 overflow-visible overflow-auto">
        <ul className="flex flex-col gap-4 text-center shadow-lg p-16 overflow-visible overflow-auto">
          {places.map((place: Place) => (
            <li
              key={uniqId.default()}
              onClick={(e) => handleSelection(e, place)}
              className="cursor-pointer border-b-2 grey9"
            >
              {[place.name, place.admin1, place.country].filter((p: string) => p.length > 0).join(", ")}
            </li>))}
        </ul>
      </div>
    </section>
  )
}

export default Modal;
