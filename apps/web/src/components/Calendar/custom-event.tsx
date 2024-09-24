import { format } from 'date-fns';
import { useState } from 'react';
import type { EventProps } from 'react-big-calendar';
import { FaVideo } from 'react-icons/fa';

import type { CalendarEvent } from './calendar-event.ts';

type CustomEventProps = EventProps<CalendarEvent>;

export const CustomEvent = ({ event }: CustomEventProps) => {
  const [isSelected, setIsSelected] = useState(false);

  let cssclasses: string;

  switch (event.type) {
    case 'lecture': {
      cssclasses = 'bg-yellow-6 text-yellow-1';
      break;
    }
    case 'conference': {
      cssclasses = 'bg-darkOrange-7 text-darkOrange-1';
      break;
    }
    case 'exam': {
      cssclasses = 'bg-red-1 text-red-5';
      break;
    }
    case 'meetups': {
      cssclasses = 'bg-green-100 text-green-600';
      break;
    }
    case 'course': {
      cssclasses = 'bg-darkOrange-0 text-darkOrange-5';
      break;
    }
    default: {
      cssclasses = 'bg-turquoise-100';
      break;
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={`${cssclasses}`}
      style={{
        padding: '10px',
        width: '100%',
        // maxHeight: `${isSelected ? '100%' : ''}`,
        height: `${isSelected ? 'fit-content' : '100%'}`,
        paddingLeft: 8,
        paddingTop: 8,
        overflow: `${isSelected ? 'visible' : 'hidden'}`,
      }}
      onPointerEnter={() => {
        setIsSelected(!isSelected);
      }}
      onPointerLeave={() => {
        setIsSelected(!isSelected);
      }}
      onKeyUp={() => {
        () => {
          alert('aa');
        };
      }}
    >
      <div className="flex flew-row text-sm pl-1">
        {`${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`}
        {event.isOnline && (
          <FaVideo className="size-6 ml-auto bg-white p-1 rounded-lg" />
        )}
      </div>
      <div className="font-semibold text-sm">{event.title}</div>
      <div className="text-sm">{event.organiser}</div>
      <div className="text-sm">{event.addressLine1}</div>
    </div>
  );
};
