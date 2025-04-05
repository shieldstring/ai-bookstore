import { Store, Users, BookOpen } from 'lucide-react';

function Stats() {
  return (
    <div className="bg-[#fdf8fe]  text-[#380B46] lg:px-24 py-8 lg:py-12 flex justify-around items-center">
      <div className="text-center">
        <div className="flex justify-center mb-2 gap-3">
          <Store className="w-8 h-8" />
          <div className="font-bold text-xl lg:text-3xl">268</div>
        </div>
        
        <div className="text-sm">Our stores around the world</div>
      </div>

      <div className="text-center">
        <div className="flex justify-center mb-2 gap-3">
          <Users className="w-8 h-8" />
          <div className="font-bold text-xl lg:text-3xl">25,634</div>
        </div>
        
        <div className="text-sm">Our happy customers</div>
      </div>

      <div className="text-center">
        <div className="flex justify-center mb-2 gap-3">
          <BookOpen className="w-8 h-8" />
          <div className="font-bold text-xl lg:text-3xl">68+k</div>
        </div>
        
        <div className="text-sm">Book Collections</div>
      </div>
    </div>
  );
}

export default Stats;