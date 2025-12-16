"use client";

import { useState } from "react";
import type { Course } from "@lib/api";

interface CourseGroup {
  courseId: number;
  courseCode: string;
  courseName: string;
  groups: number;
}

interface AddCourseFormProps {
  courses: Course[];
  courseGroups: CourseGroup[];
  onAdd: (courseGroup: CourseGroup) => void;
}

export default function AddCourseForm({ courses, courseGroups, onAdd }: AddCourseFormProps) {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [groups, setGroups] = useState("1");

  const handleAdd = () => {
    const courseId = parseInt(selectedCourseId);
    const groupsNum = parseInt(groups) || 1;

    if (!courseId) {
      return;
    }

    const course = courses.find(c => c.id === courseId);
    if (!course) {
      return;
    }

    if (courseGroups.find(cg => cg.courseId === courseId)) {
      return;
    }

    onAdd({
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      groups: groupsNum,
    });

    setSelectedCourseId("");
    setGroups("1");
  };

  const availableCourses = courses.filter(
    c => !courseGroups.find(cg => cg.courseId === c.id)
  );

  return (
    <div className="form-grid">
      <div className="form-group">
        <label className="form-label">انتخاب درس</label>
        <select
          className="form-input"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">درس را انتخاب کنید</option>
          {availableCourses.map(course => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">تعداد گروه</label>
        <input
          type="number"
          className="form-input"
          min="1"
          max="10"
          value={groups}
          onChange={(e) => setGroups(e.target.value)}
        />
      </div>
      <div className="form-group" style={{ gridColumn: "1 / -1" }}>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleAdd}
          disabled={!selectedCourseId || availableCourses.length === 0}
        >
          افزودن درس
        </button>
      </div>
    </div>
  );
}

