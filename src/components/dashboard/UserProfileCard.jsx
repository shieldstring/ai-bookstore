import { Trophy, Users, Award, Star, BookOpen } from "lucide-react";
import FormattedDate from "../FormattedDate";
import { useState } from "react";

const UserProfileCard = ({ user, groups, achievements }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard
      .writeText(user?.referralCode)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((error) => {
        console.error("Failed to copy text:", error);
      });
  };
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 text-center">
        <div className="flex justify-center items-center space-x-4 mb-4">
          {/* <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={user.avatar || "/images/avatar-placeholder.png"}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          </div> */}
          <div>
            <div className="mx-auto h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold mb-4">
              {user.name.charAt(0)}
            </div>
            <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
            {/* <p className="text-gray-600 text-sm">@{user.username}</p> */}
            <p className="text-sm text-gray-500">
              Member since <br /> <FormattedDate date={user?.createdAt} />
            </p>
            <div className="flex justify-center items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>{user.level?.toFixed(1) || "0.0"}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{user.bio || "No bio yet"}</p>

        <div className="p-2 space-y-2">
          <span className="font-normal text-[#000] underline decoration-[#9333ea] underline-offset-4 decoration-from-font">
            Refer a Friend
          </span>

          <div className="justify-center lg:justify-start items-center  gap-2 flex py-1">
            <div className=" px-6 text-sm py-3 flex items-center justify-center gap-x-2  bg-[#f3e8ff] font-semibold rounded-md shadow-xl">
              {user?.referralCode}
            </div>
            <button
              onClick={handleCopy}
              className="bg-[#8F8F8F] flex items-center text-sm text-white py-1 px-2 rounded-lg"
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5"
              >
                <path
                  d="M20.0934 2.16675H10.2396C8.1777 2.16675 6.49984 3.84461 6.49984 5.90652V6.50008H5.90628C3.84437 6.50008 2.1665 8.17795 2.1665 10.2399V20.0935C2.1665 22.1555 3.84437 23.8334 5.90628 23.8334H15.76C17.6542 23.8334 19.2073 22.4123 19.4502 20.5834H20.0933C22.1553 20.5834 23.8332 18.9055 23.8332 16.8436V5.90652C23.8332 3.84461 22.1553 2.16675 20.0934 2.16675ZM21.6665 16.8436C21.6665 17.7111 20.9608 18.4167 20.0934 18.4167H19.4998V10.2399C19.4998 8.17795 17.822 6.50008 15.7601 6.50008H8.6665V5.90652C8.6665 5.0391 9.37219 4.33341 10.2396 4.33341H20.0933C20.9608 4.33341 21.6665 5.0391 21.6665 5.90652V16.8436Z"
                  fill="white"
                />
              </svg>
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4">
        {/* <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Books read</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {user.level}
          </span>
        </div> */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-sm text-gray-500">
            <Trophy className="mr-2 h-4 w-4" />
            <span>Challenges</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {user.xp} completed
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Groups
        </h4>
        <div className="space-y-2">
          {groups.slice(0, 2).map((group) => (
            <div key={group.id} className="flex items-center text-sm">
              <span className="truncate">{group.name}</span>
              <span className="ml-auto text-gray-500">
                {group.members} members
              </span>
            </div>
          ))}
          {groups.length > 2 && (
            <button className="text-xs font-medium text-purple-600 hover:text-purple-700">
              +{groups.length - 2} more groups
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
          <Award className="mr-2 h-4 w-4" />
          Recent Achievements
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {achievements
            .filter((a) => a.earned)
            .slice(0, 3)
            .map((achievement) => (
              <div key={achievement.id} className="text-center">
                <div className="mx-auto h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mb-1">
                  <Award className="h-5 w-5" />
                </div>
                <p className="text-xs truncate">{achievement.name}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
