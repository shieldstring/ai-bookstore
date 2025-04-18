import { Trophy, Calendar, Award } from 'lucide-react';

const UpcomingChallenges = ({ challenges }) => {
  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <div key={challenge.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900">{challenge.name}</h4>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Calendar className="mr-1 h-4 w-4" />
                <span>Starts {challenge.startDate}</span>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {challenge.difficulty}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Award className="mr-1 h-4 w-4" />
              <span>{challenge.reward} points</span>
            </div>
            <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-purple-600 hover:bg-purple-700">
              Join Challenge
            </button>
          </div>
        </div>
      ))}
      <button className="w-full mt-2 text-sm font-medium text-purple-600 hover:text-purple-700 text-center">
        View all challenges
      </button>
    </div>
  );
};

export default UpcomingChallenges;