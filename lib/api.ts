/**
 * API Utility برای ارتباط با Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  type: "admin" | "student" | "instructor";
  is_staff: boolean;
  first_name: string;
  last_name: string;
  email: string;
  student_id?: string;
  instructor_code?: string;
  major?: string;
  entry_year?: number;
  department?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}

/**
 * دریافت Token از localStorage
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/**
 * ذخیره Token در localStorage
 */
export function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

/**
 * حذف Token از localStorage
 */
export function removeToken(): void {
  localStorage.removeItem("auth_token");
}

/**
 * ذخیره اطلاعات کاربر در localStorage
 */
export function setUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * دریافت اطلاعات کاربر از localStorage
 */
export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * حذف اطلاعات کاربر از localStorage
 */
export function removeUser(): void {
  localStorage.removeItem("user");
}

/**
 * ساخت Headers با Token
 */
function getHeaders(includeAuth: boolean = false): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
  }

  return headers;
}

/**
 * API: Login (Admin)
 */
export async function login(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "خطا در ورود به سیستم");
  }

  const data: LoginResponse = await response.json();
  
  // ذخیره token و اطلاعات کاربر
  setToken(data.token);
  setUser(data.user);

  return data;
}

/**
 * API: Student Login
 */
export interface StudentLoginRequest {
  student_id: string;
  password: string;
}

export async function studentLogin(
  credentials: StudentLoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/student-login/`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "خطا در ورود به سیستم");
  }

  const data: LoginResponse = await response.json();
  
  // ذخیره token و اطلاعات کاربر
  setToken(data.token);
  setUser(data.user);

  return data;
}

/**
 * API: Instructor Login
 */
export interface InstructorLoginRequest {
  instructor_code: string;
  password: string;
}

export async function instructorLogin(
  credentials: InstructorLoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/instructor-login/`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "خطا در ورود به سیستم");
  }

  const data: LoginResponse = await response.json();
  
  // ذخیره token و اطلاعات کاربر
  setToken(data.token);
  setUser(data.user);

  return data;
}

/**
 * API: Logout
 */
export async function logout(): Promise<void> {
  const token = getToken();
  
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout/`, {
        method: "POST",
        headers: getHeaders(true),
      });
    } catch (error) {
      console.error("خطا در logout:", error);
    }
  }

  // حذف token و اطلاعات کاربر
  removeToken();
  removeUser();
}

/**
 * API: دریافت اطلاعات کاربر فعلی
 */
export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
    method: "GET",
    headers: getHeaders(true),
  });

  if (!response.ok) {
    throw new Error("خطا در دریافت اطلاعات کاربر");
  }

  return await response.json();
}

/**
 * بررسی اینکه آیا کاربر لاگین کرده یا نه
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * بررسی اینکه آیا کاربر فعلی Admin است یا نه
 */
export function isAdmin(): boolean {
  const user = getUser();
  return user?.type === "admin" && user?.is_staff === true;
}

// ============= Course APIs =============

export interface Course {
  id: number;
  name: string;
  code: string;
  units: number;
  course_type: "THEORETICAL" | "PRACTICAL" | "GENERAL" | "ELECTIVE";
  prerequisites: number[];
}

export interface CourseOffering {
  id: number;
  course_id?: number;
  course_detail?: Course;
  course_name?: string;
  course_code?: string;
  course_units?: number;
  instructor: string;
  class_number: string;
  capacity: number;
  enrolled_count: number;
  class_time: string;
  exam_time: string;
  semester?: string;
  is_active?: boolean;
  is_full?: boolean;
  available_seats?: number;
}

export interface ClassStats {
  total_classes: number;
  full_classes: number;
  total_capacity: number;
  total_enrolled: number;
  average_fill_rate: number;
}

/**
 * API: دریافت لیست دروس
 */
export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${API_BASE_URL}/api/courses/`, {
    method: "GET",
    headers: getHeaders(true),
  });

  if (!response.ok) {
    throw new Error("خطا در دریافت لیست دروس");
  }

  return await response.json();
}

/**
 * API: ایجاد درس جدید
 */
export async function createCourse(course: Omit<Course, "id">): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/api/courses/`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error("خطا در ایجاد درس");
  }

  return await response.json();
}

/**
 * API: ویرایش درس
 */
export async function updateCourse(id: number, course: Partial<Course>): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/api/courses/${id}/`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    throw new Error("خطا در ویرایش درس");
  }

  return await response.json();
}

/**
 * API: حذف درس
 */
export async function deleteCourse(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/courses/${id}/`, {
    method: "DELETE",
    headers: getHeaders(true),
  });

  if (!response.ok) {
    throw new Error("خطا در حذف درس");
  }
}

// ============= CourseOffering (Class) APIs =============

/**
 * API: دریافت لیست کلاس‌ها
 */
export async function getClasses(params?: {
  semester?: string;
  instructor?: string;
  only_available?: boolean;
}): Promise<CourseOffering[]> {
  const queryParams = new URLSearchParams();
  if (params?.semester) queryParams.append("semester", params.semester);
  if (params?.instructor) queryParams.append("instructor", params.instructor);
  if (params?.only_available) queryParams.append("only_available", "true");

  const url = `${API_BASE_URL}/api/classes/${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(true),
  });

  if (!response.ok) {
    throw new Error("خطا در دریافت لیست کلاس‌ها");
  }

  return await response.json();
}

/**
 * API: دریافت آمار کلاس‌ها
 */
export async function getClassStats(): Promise<ClassStats> {
  const response = await fetch(`${API_BASE_URL}/api/classes/stats/`, {
    method: "GET",
    headers: getHeaders(true),
  });

  if (!response.ok) {
    throw new Error("خطا در دریافت آمار");
  }

  return await response.json();
}

/**
 * API: ایجاد کلاس جدید
 */
export async function createClass(classData: {
  course_id: number;
  instructor: string;
  class_number: string;
  capacity: number;
  class_time: string;
  exam_time: string;
  semester?: string;
}): Promise<CourseOffering> {
  const response = await fetch(`${API_BASE_URL}/api/classes/`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(classData),
  });

  if (!response.ok) {
    throw new Error("خطا در ایجاد کلاس");
  }

  return await response.json();
}

/**
 * API: ویرایش کلاس
 */
export async function updateClass(id: number, classData: Partial<CourseOffering>): Promise<CourseOffering> {
  const response = await fetch(`${API_BASE_URL}/api/classes/${id}/`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify(classData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Error updating class:", errorData);
    throw new Error(errorData.non_field_errors?.[0] || errorData.detail || "خطا در ویرایش کلاس");
  }

  return await response.json();
}

/**
 * API: حذف کلاس
 */
export async function deleteClass(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/classes/${id}/`, {
    method: "DELETE",
    headers: getHeaders(true),
  });

  if (!response.ok) {
    throw new Error("خطا در حذف کلاس");
  }
}

// ============= Instructor APIs =============

export interface Instructor {
  id: number;
  instructor_code: string;
  first_name: string;
  last_name: string;
  email: string;
  department?: string;
  full_name: string;
}

/**
 * API: دریافت لیست اساتید
 */
export async function getInstructors(): Promise<Instructor[]> {
  const response = await fetch(`${API_BASE_URL}/api/instructors/`, {
    method: "GET",
    headers: getHeaders(true),
  });

  if (!response.ok) {
    throw new Error("خطا در دریافت لیست اساتید");
  }

  return await response.json();
}

// ============= Student APIs =============

export interface Student {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone?: string;
  major?: string;
  entry_year?: number;
  min_units: number;
  max_units: number;
  is_active: boolean;
}

/**
 * API: جستجوی دانشجو با شماره دانشجویی
 */
export async function getStudentByStudentId(studentId: string): Promise<Student> {
  const response = await fetch(
    `${API_BASE_URL}/api/students/by_student_id/?student_id=${encodeURIComponent(studentId)}`,
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "خطا در دریافت اطلاعات دانشجو");
  }

  return await response.json();
}

/**
 * API: به‌روزرسانی واحدهای دانشجو
 */
export async function updateStudentUnits(
  studentId: number,
  minUnits: number,
  maxUnits: number
): Promise<Student> {
  const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify({
      min_units: minUnits,
      max_units: maxUnits,
    }),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "خطا در به‌روزرسانی واحدهای دانشجو");
  }

  return await response.json();
}

/**
 * API: دریافت لیست دانشجویان با واحدهای خارج از عرف
 */
export async function getStudentsWithCustomUnits(): Promise<Student[]> {
  const response = await fetch(`${API_BASE_URL}/api/students/custom_units/`, {
    method: "GET",
    headers: getHeaders(true),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "خطا در دریافت لیست دانشجویان");
  }

  return await response.json();
}

