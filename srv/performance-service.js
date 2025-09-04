const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { Students, PerformanceMetrics, Exams, AttendanceRecords } = this.entities;

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

    // Before creating/updating PerformanceMetrics, calculate grade
    this.before('CREATE', 'PerformanceMetrics', async (req) => {
        const data = req.data;
        if (data.score && data.exam_ID) {
            const exam = await SELECT.one.from(Exams).where({ ID: data.exam_ID });
            if (exam) {
                data.grade = calculateGrade(data.score, exam.maxScore);
            }
        }
    });

    this.before('UPDATE', 'PerformanceMetrics', async (req) => {
        const data = req.data;
        if (data.score) {
            const performance = await SELECT.one.from(PerformanceMetrics).where({ ID: req.data.ID });
            const exam = await SELECT.one.from(Exams).where({ ID: performance.exam_ID });
            if (exam) {
                data.grade = calculateGrade(data.score, exam.maxScore);
            }
        }
    });

    // Calculate GPA function
    this.on('calculateGPA', async (req) => {
        const { studentID } = req.data;
        
        const performances = await SELECT.from(PerformanceMetrics)
            .where({ student_ID: studentID })
            .columns(['score', 'exam_ID']);

        if (performances.length === 0) return 0.0;

        let totalPoints = 0;
        let totalCredits = 0;

        for (const perf of performances) {
            const gradePoints = getGradePoints(calculateGrade(perf.score));
            totalPoints += gradePoints;
            totalCredits += 1; // Assuming each exam has 1 credit
        }

        const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0.0;
        
        // Update the student's GPA
        await UPDATE(Students).set({ gpa }).where({ ID: studentID });
        
        return gpa;
    });

    // Get at-risk students function
    this.on('getAtRiskStudents', async (req) => {
        const { threshold } = req.data;
        
        return await SELECT.from(Students)
            .where(`gpa < ${threshold} OR gpa IS NULL`)
            .orderBy('gpa asc');
    });

    // After any performance metric changes, recalculate GPA
    this.after('CREATE', 'PerformanceMetrics', async (data, req) => {
        if (data.student_ID) {
            await this.calculateGPA({ data: { studentID: data.student_ID } });
        }
    });

    this.after('UPDATE', 'PerformanceMetrics', async (data, req) => {
        if (data.student_ID) {
            await this.calculateGPA({ data: { studentID: data.student_ID } });
        }
    });

    // Authorization - simple role-based access
    this.before('READ', 'Students', async (req) => {
        const user = req.user;
        if (user.is('Student')) {
            // Students can only see their own data
            req.query.where({ enrollmentID: user.id });
        }
    });

    this.before('READ', 'PerformanceMetrics', async (req) => {
        const user = req.user;
        if (user.is('Student')) {
            // Students can only see their own performance metrics
            const student = await SELECT.one.from(Students).where({ enrollmentID: user.id });
            if (student) {
                req.query.where({ student_ID: student.ID });
            }
        }
    });

    this.before(['CREATE', 'UPDATE', 'DELETE'], ['Students', 'Teachers', 'Classes'], (req) => {
        // Only admins can manage core entities
        if (!req.user.is('Admin')) {
            req.reject(403, 'Insufficient privileges');
        }
    });

    this.before(['CREATE', 'UPDATE'], 'PerformanceMetrics', (req) => {
        // Teachers and admins can manage grades
        if (!req.user.is('Teacher') && !req.user.is('Admin')) {
            req.reject(403, 'Only teachers and administrators can manage grades');
        }
    });

    // Helper function to convert grades to grade points for GPA calculation
    function getGradePoints(grade) {
        const gradePoints = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D': 1.0, 'F': 0.0
        };
        return gradePoints[grade] || 0.0;
    }

    // Add some computed fields for analytics
    this.after('READ', 'Exams', async (exams, req) => {
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
});