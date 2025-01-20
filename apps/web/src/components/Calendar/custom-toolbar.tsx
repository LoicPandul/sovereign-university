import type { Messages, ToolbarProps, View } from 'react-big-calendar';

import { cn } from '@blms/ui';

import type { CalendarEvent } from './calendar-event.ts';

interface ViewNamesGroupProps {
  views: any;
  messages: Messages<CalendarEvent>;
  view: View;
  onView: (view: View) => void;
}

function ViewNamesGroup({
  views,
  view,
  messages,
  onView,
}: ViewNamesGroupProps) {
  return views.map((name: View) => {
    return (
      <button
        className={cn(
          name === 'week'
            ? '!hidden md:!inline'
            : name === 'month'
              ? '!rounded-l-sm md:!rounded-none'
              : '',
          name === view && '!bg-newGray-5',
        )}
        type="button"
        key={name}
        // className={clsx({ 'rbc-active': view === name })}
        onClick={() => onView(name)}
      >
        {messages[name]}
      </button>
    );
  });
}

export default function CustomToolbar({
  // date, // available, but not used here
  label,
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
}: ToolbarProps<CalendarEvent, object>) {
  return (
    <div className="rbc-toolbar max-md:px-6">
      <span className="rbc-btn-group examples--custom-toolbar">
        <button
          type="button"
          onClick={() => onNavigate('PREV')}
          aria-label={messages.previous!.toString()}
        >
          &#60;
        </button>
        <button
          type="button"
          onClick={() => onNavigate('TODAY')}
          aria-label={messages.today!.toString()}
        >
          {label}
        </button>
        <button
          type="button"
          onClick={() => onNavigate('NEXT')}
          aria-label={messages.next!.toString()}
        >
          &#62;
        </button>
      </span>

      <span className="rbc-toolbar-label">{label}</span>

      <span className="rbc-btn-group">
        <ViewNamesGroup
          view={view}
          views={views}
          messages={messages}
          onView={onView}
        />
      </span>
    </div>
  );
}
