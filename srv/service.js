module.exports = (srv) => {
    const { Students, PerformanceMetrics, Exams } = srv.entities;

    // Calculate grade based on score
    function calculateGrade(score, maxScore = 100) {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 97) return 'A+';
        if (percentage >= 93) return 'A';
        if (percentage >= 90) return 'A-';
        if (percentage >= 87) return 'B+';
        if (percentage >= 83) return 'B';
        if (percentage >= 80) return 'B-';
        if (percentage >= 77) return 'C+';
        if (percentage >= 73) return 'C';
        if (percentage >= 70) return 'C-';
        if (percentage >= 60) return 'D';
        return 'F';
    }

    // Before creating PerformanceMetrics, calculate grade
    srv.before('CREATE', 'PerformanceMetrics', async (req) => {
        console.log('Before CREATE PerformanceMetrics:', req.data);
        const data = req.data;
        if (data.score && data.exam_ID) {
            const exam = await SELECT.one.from(Exams).where({ ID: data.exam_ID });
            console.log('Found exam:', exam);
            if (exam) {
                data.grade = calculateGrade(data.score, exam.maxScore);
                console.log('Calculated grade:', data.grade);
            }
        }
    });

    // Before updating PerformanceMetrics, calculate grade  
    srv.before('UPDATE', 'PerformanceMetrics', async (req) => {
        console.log('Before UPDATE PerformanceMetrics:', req.data);
        const data = req.data;
        if (data.score) {
            let examId = data.exam_ID;
            if (!examId) {
                const performance = await SELECT.one.from(PerformanceMetrics).where({ ID: req.data.ID });
                examId = performance?.exam_ID;
            }
            if (examId) {
                const exam = await SELECT.one.from(Exams).where({ ID: examId });
                if (exam) {
                    data.grade = calculateGrade(data.score, exam.maxScore);
                    console.log('Updated grade:', data.grade);
                }
            }
        }
    });

    // After CREATE/UPDATE - calculate GPA
    srv.after(['CREATE', 'UPDATE'], 'PerformanceMetrics', async (data, req) => {
        console.log('After CREATE/UPDATE PerformanceMetrics:', data);
        if (data.student_ID) {
            await calculateStudentGPA(data.student_ID);
        }
    });

    async function calculateStudentGPA(studentID) {
        const performances = await SELECT.from(PerformanceMetrics)
            .where({ student_ID: studentID })
            .columns(['score', 'grade']);

        if (performances.length > 0) {
            let totalPoints = 0;
            let totalCredits = 0;

            for (const perf of performances) {
                const gradePoints = getGradePoints(perf.grade);
                totalPoints += gradePoints;
                totalCredits += 1; // Each exam has 1 credit
            }

            const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0.0;
            await UPDATE(Students).set({ gpa: Math.round(gpa * 100) / 100 }).where({ ID: studentID });
            console.log(`Updated GPA for student ${studentID}: ${gpa}`);
        }
    }

    function getGradePoints(grade) {
        const gradePoints = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D': 1.0, 'F': 0.0
        };
        return gradePoints[grade] || 0.0;
    }

    // Add computed fields for analytics
    srv.after('READ', 'Exams', async (exams) => {
        if (Array.isArray(exams)) {
            for (const exam of exams) {
                await enrichExamWithStats(exam);
            }
        } else if (exams) {
            await enrichExamWithStats(exams);
        }
    });

    async function enrichExamWithStats(exam) {
        const performances = await SELECT.from(PerformanceMetrics)
            .where({ exam_ID: exam.ID })
            .columns(['score']);

        if (performances.length > 0) {
            const scores = performances.map(p => p.score);
            const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            const passCount = scores.filter(score => score >= 60).length;
            const passRate = (passCount / scores.length) * 100;

            exam.averageScore = Math.round(avgScore * 100) / 100;
            exam.passRate = Math.round(passRate * 100) / 100;
        }
    }
};