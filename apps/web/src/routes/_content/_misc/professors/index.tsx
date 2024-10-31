import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_content/_misc/professors/')({
  loader: () => {
    return redirect({
      to: '/professors/all',
      throw: false,
    });
  },
});
