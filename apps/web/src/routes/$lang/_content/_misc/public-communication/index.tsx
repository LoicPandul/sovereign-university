import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/$lang/_content/_misc/public-communication/',
)({
  loader: () => {
    return redirect({
      to: '/public-communication/blogs-and-news',
      throw: false,
    });
  },
});
