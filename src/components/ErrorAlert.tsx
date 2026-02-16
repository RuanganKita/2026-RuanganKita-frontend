interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
        {message}
      </div>
    </div>
  );
}
