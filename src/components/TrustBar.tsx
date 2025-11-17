import { useEffect, useState } from 'react';

export default function TrustBar() {
  const [students, setStudents] = useState(0);
  const [cvs, setCvs] = useState(0);
  const [improvement, setImprovement] = useState(0);

  useEffect(() => {
    const studentsInterval = setInterval(() => {
      setStudents(prev => {
        if (prev >= 5000) {
          clearInterval(studentsInterval);
          return 5000;
        }
        return prev + 100;
      });
    }, 10);

    const cvsInterval = setInterval(() => {
      setCvs(prev => {
        if (prev >= 10000) {
          clearInterval(cvsInterval);
          return 10000;
        }
        return prev + 200;
      });
    }, 10);

    const improvementInterval = setInterval(() => {
      setImprovement(prev => {
        if (prev >= 45) {
          clearInterval(improvementInterval);
          return 45;
        }
        return prev + 1;
      });
    }, 20);

    return () => {
      clearInterval(studentsInterval);
      clearInterval(cvsInterval);
      clearInterval(improvementInterval);
    };
  }, []);

  return (
    <section className="py-12 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-lg font-semibold text-secondary">
            Powered by insights from 600+ elite CVs
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 mb-12 opacity-60">
          <div className="text-sm font-bold text-gray-600">IIM Ahmedabad</div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="text-sm font-bold text-gray-600">IIM Bangalore</div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="text-sm font-bold text-gray-600">IIM Calcutta</div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="text-sm font-bold text-gray-600">Top B-Schools</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-black text-primary mb-2">
              {students.toLocaleString()}+
            </div>
            <div className="text-gray-600 font-semibold">Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-primary mb-2">
              {cvs.toLocaleString()}+
            </div>
            <div className="text-gray-600 font-semibold">CVs Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-primary mb-2">
              {improvement}%
            </div>
            <div className="text-gray-600 font-semibold">Average Score Improvement</div>
          </div>
        </div>
      </div>
    </section>
  );
}
