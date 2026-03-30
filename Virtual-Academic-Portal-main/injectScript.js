const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'server', 'controllers', 'analyticsController.js');
let code = fs.readFileSync(p, 'utf8');

const injection = `
    const assignmentPerformance = assignments.map((a) => {
      const subs = submissions.filter(s => s.assignment.toString() === a._id.toString());
      const graded = subs.filter(s => s.status === "graded");
      const avgScore = graded.length > 0 ? Math.round(graded.reduce((acc, curr) => acc + (curr.grade || 0), 0) / graded.length) : 0;
      return {
        assignmentName: a.title,
        submissionRate: totalStudents > 0 ? Math.round((subs.length / totalStudents) * 100) : 0,
        averageScore: avgScore
      };
    });

    const quizMap = {};
    const coursesWithLessons = await Course.find({ teacher: teacherId }).populate('lessons.quiz');
    const quizIdToTitle = {};
    coursesWithLessons.forEach(c => {
      c.lessons.forEach(l => {
        if (l.quiz && l.quiz._id) quizIdToTitle[l.quiz._id.toString()] = l.title;
      });
    });

    quizAttempts.forEach(attempt => {
      const qId = attempt.quiz ? attempt.quiz.toString() : 'unknown';
      if (!quizMap[qId]) quizMap[qId] = { name: quizIdToTitle[qId] || "Course Quiz", attempts: 0, score: 0 };
      quizMap[qId].attempts += 1;
      quizMap[qId].score += attempt.score || 0;
    });
    
    const quizPerformance = Object.values(quizMap).map(q => ({
      quizName: q.name,
      totalAttempts: q.attempts,
      averageScore: Math.round(q.score / q.attempts)
    }));

    const allStudents = await User.find({
      _id: { $in: Array.from(uniqueStudents) },
      role: "student",
    }).select("name points");

    const atRiskStudents = [];
    allStudents.forEach(student => {
      const sId = student._id.toString();
      const sSubs = submissions.filter(s => s.student && s.student.toString() === sId);
      const sAtts = quizAttempts.filter(a => a.student && a.student.toString() === sId);
      
      const avgQScore = sAtts.length > 0 ? (sAtts.reduce((acc, curr) => acc + (curr.score || 0), 0) / sAtts.length) : 0;

      if (sSubs.length === 0) {
        atRiskStudents.push({ name: student.name, reason: "No submissions" });
      } else if (sAtts.length === 0) {
        atRiskStudents.push({ name: student.name, reason: "No quiz attempts" });
      } else if (avgQScore < 50) {
        atRiskStudents.push({ name: student.name, reason: \`Low average score: \${Math.round(avgQScore)}%\` });
      }
    });

    const activeStudents = new Set([
      ...submissions.filter(s => s.student).map(s => s.student.toString()), 
      ...quizAttempts.filter(a => a.student).map(a => a.student.toString())
    ]).size;
    const engagementRate = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;

`;

const newResObjKeys = `
      assignmentPerformance,
      quizPerformance,
      topStudents: [...allStudents].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5).map(u => ({ name: u.name, averageScore: avgQuizScore, points: u.points || 0 })),
      atRiskStudents,
      engagementRate,
      recentCourses,
    });
  } catch (err) {
`;

code = code.replace("    res.json({\r\n      totalCourses,", injection + "    res.json({\r\n      totalCourses,");
code = code.replace("    res.json({\n      totalCourses,", injection + "    res.json({\n      totalCourses,");

code = code.replace("      recentCourses,\r\n    });\r\n  } catch (err) {", newResObjKeys);
code = code.replace("      recentCourses,\n    });\n  } catch (err) {", newResObjKeys);

fs.writeFileSync(p, code);
console.log("Success");
