const QuizAttempt = require("../models/QuizAttempt");

const getEnhancedStudentAttempts = async (studentId) => {

    // Fetch all attempts sorted by course + date
    const attempts = await QuizAttempt.find({ student: studentId })
        .populate("course", "title")
        .sort({ course: 1, createdAt: 1 });

    const enhancedAttempts = [];

    let lastScoreByCourse = {};

    for (let attempt of attempts) {
        const courseId = attempt.course._id.toString();

        const previousScore = lastScoreByCourse[courseId] ?? null;

        enhancedAttempts.push({
            ...attempt._doc,
            previousScore,
            scoreDifference:
                previousScore !== null
                    ? attempt.score - previousScore
                    : null,
            improved:
                previousScore !== null
                    ? attempt.score > previousScore
                    : null,
        });

        // Update last score for that course
        lastScoreByCourse[courseId] = attempt.score;
    }

    // Show latest first in UI
    return enhancedAttempts.reverse();
};

module.exports = {
    getEnhancedStudentAttempts,
};