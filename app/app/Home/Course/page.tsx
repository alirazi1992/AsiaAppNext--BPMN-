'use client';
import Course from '@/app/EndPoints-AsiaApp/Components/Pages/M_Education/Courses/Course-MainContainer';
import WithAuth from '@/app/EndPoints-AsiaApp/Components/Layout/HOC'
const CoursePage = () => {
    return (
        <Course />
    )
}

export default WithAuth(CoursePage); 