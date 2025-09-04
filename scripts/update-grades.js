const cds = require('@sap/cds');

async function updateGrades() {
    try {
        const db = await cds.connect.to('sqlite', { 
            kind: 'sqlite',
            database: './db.sqlite'
        });
        
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

        // Get all performance metrics
        const metrics = await db.run(
            'SELECT pm.ID, pm.score, pm.student_ID, e.maxScore FROM com_college_performance_PerformanceMetrics pm ' +
            'JOIN com_college_performance_Exams e ON pm.exam_ID = e.ID'
        );

        console.log(`Found ${metrics.length} performance metrics to update`);

        for (const metric of metrics) {
            const grade = calculateGrade(metric.score, metric.maxScore || 100);
            await db.run(
                'UPDATE com_college_performance_PerformanceMetrics SET grade = ? WHERE ID = ?',
                [grade, metric.ID]
            );
            console.log(`Updated ${metric.ID}: score ${metric.score} -> grade ${grade}`);
        }

        // Get all students
        const students = await db.run('SELECT ID, firstName, lastName FROM com_college_performance_Students');
        
        for (const student of students) {
            const performances = await db.run(
                'SELECT grade FROM com_college_performance_PerformanceMetrics WHERE student_ID = ? AND grade IS NOT NULL',
                [student.ID]
            );

            if (performances.length > 0) {
                let totalPoints = 0;
                let totalCredits = 0;

                for (const perf of performances) {
                    const gradePoints = getGradePoints(perf.grade);
                    totalPoints += gradePoints;
                    totalCredits += 1;
                }

                const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0.0;
                await db.run(
                    'UPDATE com_college_performance_Students SET gpa = ? WHERE ID = ?',
                    [Math.round(gpa * 100) / 100, student.ID]
                );
                console.log(`Updated GPA for ${student.firstName} ${student.lastName}: ${gpa.toFixed(2)}`);
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

        console.log('Grade update complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error updating grades:', error);
        process.exit(1);
    }
}

updateGrades();