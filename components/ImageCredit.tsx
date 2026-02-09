interface ImageCreditProps {
  photographerName: string;
  photographerUrl: string;
  unsplashUrl: string;
}

export function ImageCredit({ photographerName, photographerUrl, unsplashUrl }: ImageCreditProps) {
  return (
    <p className="text-xs text-gray-500 mt-1">
      Photo by{' '}
      <a
        href={photographerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-gray-700"
      >
        {photographerName}
      </a>
      {' '}on{' '}
      <a
        href={unsplashUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-gray-700"
      >
        Unsplash
      </a>
    </p>
  );
}
