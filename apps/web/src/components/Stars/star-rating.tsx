import { cn } from '@blms/ui';

interface StarRatingProps extends React.HTMLProps<HTMLDivElement> {
  rating: number;
  totalStars?: number;
  fillColor?: string;
  strokeColor?: string;
  unfilledStrokeColor?: string;
  starSize?: number;
}

export const StarRating = ({
  rating,
  totalStars = 5,
  fillColor = '#FF5C00',
  strokeColor = '#FF5C00',
  unfilledStrokeColor = '#FF5C0030',
  starSize = 30,
  className,
}: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const partialStar = rating - fullStars;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg
        key={`full-${i}`}
        width={starSize}
        height={starSize}
        viewBox={`0 0 30 30`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.1097 4.31695C14.3978 3.73328 14.5418 3.44144 14.7374 3.3482C14.9075 3.26707 15.1052 3.26707 15.2754 3.3482C15.4709 3.44144 15.615 3.73328 15.9031 4.31695L18.6364 9.85441C18.7215 10.0267 18.764 10.1129 18.8262 10.1798C18.8812 10.239 18.9472 10.287 19.0205 10.3211C19.1033 10.3596 19.1984 10.3735 19.3885 10.4013L25.5026 11.2949C26.1464 11.389 26.4683 11.4361 26.6173 11.5934C26.7469 11.7302 26.8079 11.9182 26.7832 12.105C26.7549 12.3198 26.5218 12.5468 26.0557 13.0008L21.6332 17.3083C21.4953 17.4426 21.4264 17.5097 21.3819 17.5896C21.3425 17.6604 21.3172 17.7381 21.3075 17.8184C21.2965 17.9092 21.3127 18.004 21.3453 18.1937L22.3888 24.278C22.4989 24.9197 22.5539 25.2405 22.4505 25.4309C22.3605 25.5966 22.2005 25.7128 22.0152 25.7471C21.8021 25.7866 21.514 25.6351 20.9377 25.3321L15.4718 22.4576C15.3015 22.368 15.2164 22.3233 15.1266 22.3057C15.0472 22.2901 14.9655 22.2901 14.8861 22.3057C14.7964 22.3233 14.7112 22.368 14.5409 22.4576L9.075 25.3321C8.49874 25.6351 8.21061 25.7866 7.99756 25.7471C7.8122 25.7128 7.65225 25.5966 7.56227 25.4309C7.45885 25.2405 7.51388 24.9197 7.62394 24.278L8.66746 18.1937C8.69999 18.004 8.71625 17.9092 8.70525 17.8184C8.6955 17.7381 8.67024 17.6604 8.63085 17.5896C8.58638 17.5097 8.51744 17.4426 8.37958 17.3083L3.95705 13.0008C3.49093 12.5468 3.25787 12.3198 3.22951 12.105C3.20483 11.9182 3.26579 11.7302 3.39541 11.5934C3.54439 11.4361 3.86631 11.389 4.51015 11.2949L10.6242 10.4013C10.8144 10.3735 10.9094 10.3596 10.9922 10.3211C11.0656 10.287 11.1315 10.239 11.1866 10.1798C11.2487 10.1129 11.2913 10.0267 11.3763 9.85441L14.1097 4.31695Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>,
    );
  }

  if (partialStar > 0) {
    stars.push(
      <svg
        key="partial"
        width={starSize}
        height={starSize}
        viewBox={`0 0 30 30`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="partialStarGradient">
            <stop offset={`${partialStar * 100}%`} stopColor={fillColor} />
            <stop offset={`${partialStar * 100}%`} stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M14.1097 4.31695C14.3978 3.73328 14.5418 3.44144 14.7374 3.3482C14.9075 3.26707 15.1052 3.26707 15.2754 3.3482C15.4709 3.44144 15.615 3.73328 15.9031 4.31695L18.6364 9.85441C18.7215 10.0267 18.764 10.1129 18.8262 10.1798C18.8812 10.239 18.9472 10.287 19.0205 10.3211C19.1033 10.3596 19.1984 10.3735 19.3885 10.4013L25.5026 11.2949C26.1464 11.389 26.4683 11.4361 26.6173 11.5934C26.7469 11.7302 26.8079 11.9182 26.7832 12.105C26.7549 12.3198 26.5218 12.5468 26.0557 13.0008L21.6332 17.3083C21.4953 17.4426 21.4264 17.5097 21.3819 17.5896C21.3425 17.6604 21.3172 17.7381 21.3075 17.8184C21.2965 17.9092 21.3127 18.004 21.3453 18.1937L22.3888 24.278C22.4989 24.9197 22.5539 25.2405 22.4505 25.4309C22.3605 25.5966 22.2005 25.7128 22.0152 25.7471C21.8021 25.7866 21.514 25.6351 20.9377 25.3321L15.4718 22.4576C15.3015 22.368 15.2164 22.3233 15.1266 22.3057C15.0472 22.2901 14.9655 22.2901 14.8861 22.3057C14.7964 22.3233 14.7112 22.368 14.5409 22.4576L9.075 25.3321C8.49874 25.6351 8.21061 25.7866 7.99756 25.7471C7.8122 25.7128 7.65225 25.5966 7.56227 25.4309C7.45885 25.2405 7.51388 24.9197 7.62394 24.278L8.66746 18.1937C8.69999 18.004 8.71625 17.9092 8.70525 17.8184C8.6955 17.7381 8.67024 17.6604 8.63085 17.5896C8.58638 17.5097 8.51744 17.4426 8.37958 17.3083L3.95705 13.0008C3.49093 12.5468 3.25787 12.3198 3.22951 12.105C3.20483 11.9182 3.26579 11.7302 3.39541 11.5934C3.54439 11.4361 3.86631 11.389 4.51015 11.2949L10.6242 10.4013C10.8144 10.3735 10.9094 10.3596 10.9922 10.3211C11.0656 10.287 11.1315 10.239 11.1866 10.1798C11.2487 10.1129 11.2913 10.0267 11.3763 9.85441L14.1097 4.31695Z"
          fill="url(#partialStarGradient)"
          stroke={unfilledStrokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>,
    );
  }

  for (let i = stars.length; i < totalStars; i++) {
    stars.push(
      <svg
        key={`empty-${i}`}
        width={starSize}
        height={starSize}
        viewBox={`0 0 30 30`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.1097 4.31695C14.3978 3.73328 14.5418 3.44144 14.7374 3.3482C14.9075 3.26707 15.1052 3.26707 15.2754 3.3482C15.4709 3.44144 15.615 3.73328 15.9031 4.31695L18.6364 9.85441C18.7215 10.0267 18.764 10.1129 18.8262 10.1798C18.8812 10.239 18.9472 10.287 19.0205 10.3211C19.1033 10.3596 19.1984 10.3735 19.3885 10.4013L25.5026 11.2949C26.1464 11.389 26.4683 11.4361 26.6173 11.5934C26.7469 11.7302 26.8079 11.9182 26.7832 12.105C26.7549 12.3198 26.5218 12.5468 26.0557 13.0008L21.6332 17.3083C21.4953 17.4426 21.4264 17.5097 21.3819 17.5896C21.3425 17.6604 21.3172 17.7381 21.3075 17.8184C21.2965 17.9092 21.3127 18.004 21.3453 18.1937L22.3888 24.278C22.4989 24.9197 22.5539 25.2405 22.4505 25.4309C22.3605 25.5966 22.2005 25.7128 22.0152 25.7471C21.8021 25.7866 21.514 25.6351 20.9377 25.3321L15.4718 22.4576C15.3015 22.368 15.2164 22.3233 15.1266 22.3057C15.0472 22.2901 14.9655 22.2901 14.8861 22.3057C14.7964 22.3233 14.7112 22.368 14.5409 22.4576L9.075 25.3321C8.49874 25.6351 8.21061 25.7866 7.99756 25.7471C7.8122 25.7128 7.65225 25.5966 7.56227 25.4309C7.45885 25.2405 7.51388 24.9197 7.62394 24.278L8.66746 18.1937C8.69999 18.004 8.71625 17.9092 8.70525 17.8184C8.6955 17.7381 8.67024 17.6604 8.63085 17.5896C8.58638 17.5097 8.51744 17.4426 8.37958 17.3083L3.95705 13.0008C3.49093 12.5468 3.25787 12.3198 3.22951 12.105C3.20483 11.9182 3.26579 11.7302 3.39541 11.5934C3.54439 11.4361 3.86631 11.389 4.51015 11.2949L10.6242 10.4013C10.8144 10.3735 10.9094 10.3596 10.9922 10.3211C11.0656 10.287 11.1315 10.239 11.1866 10.1798C11.2487 10.1129 11.2913 10.0267 11.3763 9.85441L14.1097 4.31695Z"
          fill="none"
          stroke={unfilledStrokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>,
    );
  }

  return <div className={cn('flex gap-5', className)}>{stars}</div>;
};