const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'server', 'controllers', 'analyticsController.js');
let code = fs.readFileSync(targetFile, 'utf8');

// 1. Fix QuizAttempt.find to populate quiz
code = code.replace(
  'const quizAttempts = await QuizAttempt.find({\r\n      course: { $in: courseIds },\r\n    });',
  'const quizAttempts = await QuizAttempt.find({\r\n      course: { $in: courseIds },\r\n    }).populate("quiz", "title");'
);
code = code.replace(
  'const quizAttempts = await QuizAttempt.find({\n      course: { $in: courseIds },\n    });',
  'const quizAttempts = await QuizAttempt.find({\n      course: { $in: courseIds },\n    }).populate("quiz", "title");'
);

// 2. Remove Course.populate and fix quizMap grouping
const badQuizMap = `    const quizMap = {};\r\n    const coursesWithLessons = await Course.find({ teacher: teacherId }).populate('lessons.quiz');\r\n    const quizIdToTitle = {};\r\n    coursesWithLessons.forEach(c => {\r\n      c.lessons.forEach(l => {\r\n        if (l.quiz && l.quiz._id) quizIdToTitle[l.quiz._id.toString()] = l.title;\r\n      });\r\n    });\r\n\r\n    quizAttempts.forEach(attempt => {\r\n      const qId = attempt.quiz ? attempt.quiz.toString() : 'unknown';\r\n      if (!quizMap[qId]) quizMap[qId] = { name: quizIdToTitle[qId] || "Course Quiz", attempts: 0, score: 0 };\r\n      quizMap[qId].attempts += 1;\r\n      quizMap[qId].score += attempt.score || 0;\r\n    });`;

const badQuizMapUnix = badQuizMap.replace(/\r\n/g, '\n');

const goodQuizMap = `    const quizMap = {};
    quizAttempts.forEach(attempt => {
      const qId = attempt.quiz ? attempt.quiz._id.toString() : 'unknown';
      if (!quizMap[qId]) quizMap[qId] = { name: attempt.quiz?.title || "Quiz", attempts: 0, score: 0 };
      quizMap[qId].attempts += 1;
      quizMap[qId].score += attempt.score || 0;
    });`;

code = code.replace(badQuizMap, goodQuizMap);
code = code.replace(badQuizMapUnix, goodQuizMap);

// 3. Remove duplicate JSON properties
const badJsonReturn = `      assignmentPerformance,\r\n      quizPerformance,\r\n      topStudents: [...allStudents].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5).map(u => ({ name: u.name, averageScore: avgQuizScore, points: u.points || 0 })),\r\n      atRiskStudents,\r\n      engagementRate,\r\n\r\n      assignmentPerformance,\r\n      quizPerformance,\r\n      topStudents: [...allStudents].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5).map(u => ({ name: u.name, averageScore: avgQuizScore, points: u.points || 0 })),\r\n      atRiskStudents,\r\n      engagementRate,\r\n      recentCourses,\r\n    });`;
const badJsonReturnUnix = badJsonReturn.replace(/\r\n/g, '\n');

const goodJsonReturn = `      assignmentPerformance,
      quizPerformance,
      topStudents: [...allStudents].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5).map(u => ({ name: u.name, averageScore: avgQuizScore, points: u.points || 0 })),
      atRiskStudents,
      engagementRate,
      recentCourses,
    });`;

code = code.replace(badJsonReturn, goodJsonReturn);
code = code.replace(badJsonReturnUnix, goodJsonReturn);

// 4. Update the catch block to return exactly what user requested
const badCatch = `  } catch (err) {\r\n\r\n\r\n    console.error("TEACHER ANALYTICS ERROR:", err);\r\n    res.status(500).json({ message: err.message });\r\n  }`;
const badCatchUnix = badCatch.replace(/\r\n/g, '\n');

const goodCatch = `  } catch (err) {
    console.error("TEACHER ANALYTICS ERROR:", err);
    return res.json({
      engagementRate: 0,
      assignmentPerformance: [],
      quizPerformance: [],
      topStudents: [],
      atRiskStudents: []
    });
  }`;

// I need to use regex to strictly catch the error block since spacing might vary
code = code.replace(/} catch \(err\) {[\s\S]*?res\.status\(500\)\.json\({ message: err\.message }\);\s*}/g, goodCatch);

fs.writeFileSync(targetFile, code);
console.log("Success");
