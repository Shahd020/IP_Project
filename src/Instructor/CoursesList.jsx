function CoursesList() {

  const courses = [
    {title:"React Development", students:120},
    {title:"AI Fundamentals", students:80}
  ];

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        My Courses
      </h1>

      <div className="grid grid-cols-2 gap-6">

        {courses.map((course,index)=>(
          <div key={index} className="bg-[#1f2937] p-6 rounded-xl">

            <h2 className="text-xl font-bold">
              {course.title}
            </h2>

            <p className="text-gray-400">
              Students: {course.students}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default CoursesList;