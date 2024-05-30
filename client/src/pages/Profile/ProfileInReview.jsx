import SafeSpinner from "../../assets/spinner-safe.gif";

export default function ProfileInReview() {
  return (
    <>
      <div className="flex-col text-center h-[30vh] mt-10 mb-10">
        <div className="flex justify-center">
          <img src={SafeSpinner} width={44} height={44} />
        </div>
        <h2 className="text-xl font-bold mt-4 text-red-400 hover:text-red-600">
          Pending Request
        </h2>
        <div className="bg-white p-3 mt-4 rounded-xl shadow-xl">
          <p className="mt-3 text-gray-700">
            Your profile is in review,
            <br /> we are taking time to double check you match with this
            platform, please just wait
          </p>
          <br />
          <p className="text-gray-500 pb-4">
            we take care about houseav safety
          </p>
        </div>
      </div>
    </>
  );
}
