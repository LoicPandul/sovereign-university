import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { Loader } from '@blms/ui';

import { MainLayout } from '#src/components/main-layout.js';
import { trpc } from '#src/utils/trpc.js';

export const Route = createFileRoute('/_content/events/$eventId')({
  params: {
    parse: (params) => ({
      eventId: z.string().parse(params.eventId),
    }),
    stringify: ({ eventId }) => ({ eventId: `${eventId}` }),
  },
  component: EventDetails,
});

function EventDetails() {
  const params = Route.useParams();

  const { data: event, isFetched } = trpc.content.getEvent.useQuery({
    id: params.eventId,
  });

  let videoUrl: string = '';
  if (event?.replayUrl) {
    videoUrl = event?.replayUrl;
  } else if (event?.liveUrl) {
    videoUrl = event?.liveUrl + '?autoplay=1&muted=1&peertubeLink=0';
  }

  return (
    <MainLayout>
      <div className="flex flex-col px-5">
        {!isFetched && <Loader size={'s'} />}
        <div className="w-full max-w-3xl self-center mx-8 mt-24 flex flex-col items-start gap-2">
          <h1 className="text-lg md:text-2xl text-orange-500 font-medium">
            {event?.name}
          </h1>
          <p className="text-sm md:text-lg font-medium">{event?.description}</p>

          <div className="w-full flex flex-col md:flex-row gap-2 md:gap-6">
            <div className="flex flex-col gap-6 w-full items-center">
              {videoUrl && (
                <iframe
                  title={`Live ${event?.name}`}
                  className="w-full aspect-video"
                  src={videoUrl}
                  allowFullScreen={true}
                  sandbox="allow-same-origin allow-scripts allow-popups"
                ></iframe>
              )}
              {event?.chatUrl && (
                <iframe
                  src="https://peertube.planb.network/plugins/livechat/router/webchat/room/4f4a811a-2d98-40dc-80ea-736088b408e7"
                  title="Chat"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  className="w-full"
                  height="315"
                ></iframe>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
