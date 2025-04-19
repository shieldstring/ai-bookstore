import { Trophy, Users, Award, Star, BookOpen } from "lucide-react";

const UserProfileCard = ({ user, groups, achievements }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 text-center">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={user.avatar || "/images/avatar-placeholder.png"}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="mx-auto h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold mb-4">
              {user.name.charAt(0)}
            </div>
            <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
            <p className="text-gray-600 text-sm">@{user.username}</p>
            <p className="text-sm text-gray-500">
              Member since {user.memberSince}
            </p>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>{user.stats?.rating?.toFixed(1) || "0.0"}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{user.bio || "No bio yet"}</p>
      </div>

      <div className="border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Books read</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {user.stats?.booksRead || 0}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-sm text-gray-500">
            <Trophy className="mr-2 h-4 w-4" />
            <span>Challenges</span>
          </div>
          <span className="text-sm font-medium text-gray-900">5 completed</span>
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
