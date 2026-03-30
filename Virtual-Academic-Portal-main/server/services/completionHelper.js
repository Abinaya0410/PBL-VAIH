const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const CourseProgress = require("../models/CourseProgress");

/**
 * Dynamically evaluates whether a student has completed a course.
 * Logic: All lessons done AND (!hasAssignment || assignmentDone) AND (!hasQuiz || quizPassed).
 */
async function evaluateCourseCompletion(studentId, courseId) {
  try {
    console.log(`\n--- EVALUATING COMPLETION: STUDENT ${studentId} | COURSE ${courseId} ---`);

    // 1. Total lessons in course
    const totalLessons = await Lesson.countDocuments({ course: courseId });
    const lessonIds = await Lesson.find({ course: courseId }).distinct("_id");
    
    // 2. Lessons completed by student
    const completedLessons = await LessonProgress.countDocuments({
      student: studentId,
      lesson: { $in: lessonIds },
      completed: true
    });
    const lessonsDone = totalLessons === 0 || completedLessons === totalLessons;
    console.log(`LESSONS: ${completedLessons}/${totalLessons} -> ${lessonsDone}`);

    // 3. Assignment Check
    const courseAssignment = await Assignment.findOne({ course: courseId });
    let assignmentDone = true; 
    
    if (courseAssignment) {
      // Find submission: Match by course ID OR direct assignment ID (fallback for legacy)
      const submission = await AssignmentSubmission.findOne({
        student: studentId,
        $or: [
          { course: courseId },
          { assignment: courseAssignment._id }
        ],
        status: "graded"
      });
      assignmentDone = !!submission;
      console.log(`ASSIGNMENT (${courseAssignment.title}): status -> ${submission ? submission.status : 'missing'} -> ${assignmentDone}`);
    } else {
      console.log(`ASSIGNMENT: Not required (no assignment in this course)`);
    }

    // 4. Quiz Check
    const courseQuiz = await Quiz.findOne({ course: courseId });
    let quizPassed = true;
    
    if (courseQuiz) {
      // Handles both score formats (percentage/raw) and missing course field fallback
      const passAttempt = await QuizAttempt.findOne({
        student: studentId,
        $or: [
          // Match by course ID
          { 
            course: courseId,
            $or: [
              { lesson: { $exists: false }, score: { $gte: 60 } }, // course quiz percentage (60%)
              { lesson: { $exists: true },  score: { $gte: 12 } }  // lesson quiz raw count (12/20 = 60%)
            ]
          },
          // Fallback for old records: Match by lesson IDs belonging to this course
          {
            lesson: { $in: lessonIds },
            score: { $gte: 12 }
          }
        ]
      });
      quizPassed = !!passAttempt;
      console.log(`QUIZ: score ${passAttempt ? passAttempt.score : 'N/A'} -> passed: ${quizPassed}`);
    } else {
      console.log(`QUIZ: Not required (no quiz in this course)`);
    }

    const isCompleted = lessonsDone && assignmentDone && quizPassed;
    
    // 4.5 Calculate Progress Percentage
    const totalUnits = totalLessons + (courseAssignment ? 1 : 0) + (courseQuiz ? 1 : 0);
    const completedUnits = (totalLessons === 0 ? 0 : completedLessons) + 
                          (courseAssignment && assignmentDone ? 1 : 0) + 
                          (courseQuiz && quizPassed ? 1 : 0);
    
    let progress = 0;
    if (totalUnits > 0) {
      progress = Math.round((completedUnits / totalUnits) * 100);
    }

    // 4.6 Determine Status
    let status = "enrolled";
    if (progress === 100 && totalUnits > 0) {
      status = "completed";
    } else if (progress > 0) {
      status = "in-progress";
    }

    const finalCompletion = (status === "completed");

    console.log(`PROGRESS: ${progress}% | STATUS: ${status} | TOTAL UNITS: ${totalUnits}`);
    console.log(`>>> FINAL COMPLETION STATUS: ${finalCompletion} <<<\n`);

    // 5. Persist Result
    await CourseProgress.findOneAndUpdate(
      { student: studentId, course: courseId },
      {
        completedAt: finalCompletion ? (new Date()) : null,
        progress: progress,
        status: status
      },
      { upsert: true, new: true }
    );

    return finalCompletion;

  } catch (error) {
    console.error("Error in evaluateCourseCompletion:", error);
    return false;
  }
}

module.exports = { evaluateCourseCompletion };
