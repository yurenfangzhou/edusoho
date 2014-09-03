<?php
namespace Topxia\MobileBundleV2\Service;

interface CourseService
{
	public function getVersion();
	public function getCourses();
	public function getLearningCourse();
	public function searchCourse();
	public function getCourse();
	public function getReviews();

	public function favoriteCourse();
	public function unFavoriteCourse();
	public function getTeacherCourses();

	public function getCourseNotice();
}