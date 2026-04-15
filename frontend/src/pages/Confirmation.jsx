import { useLocation, useNavigate } from "react-router-dom";

const Confirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-8 rounded-xl shadow text-center max-w-md">
        
        <h2 className="text-2xl font-semibold mb-4">
          Booking Confirmed 🎉
        </h2>

        {state && (
          <>
            <p className="mb-2">
              <strong>Name:</strong> {state.name}
            </p>

            <p className="mb-2">
              <strong>Date:</strong> {state.date}
            </p>

            <p className="mb-2">
              <strong>Time:</strong> {state.time}
            </p>
          </>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-black text-white px-4 py-2 rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Confirmation;