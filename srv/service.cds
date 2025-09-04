using { com.college.performance as my } from '../db/schema';

service PerformanceService {
    @odata.draft.enabled
    entity Students as projection on my.Students;

    @odata.draft.enabled
    entity Teachers as projection on my.Teachers;

    @odata.draft.enabled
    entity Classes as projection on my.Classes;

    @odata.draft.enabled
    entity Exams as projection on my.Exams;
    
    @odata.draft.enabled
    entity PerformanceMetrics as projection on my.PerformanceMetrics;

    @odata.draft.enabled
    entity ClassEnrollments as projection on my.ClassEnrollments;

    @odata.draft.enabled
    entity AttendanceRecords as projection on my.AttendanceRecords;

    // Functions for business logic
    function calculateGPA(studentID: UUID) returns Decimal(3,2);
    function getAtRiskStudents(threshold: Decimal(3,2)) returns array of Students;
}

// --- ANNOTATIONS FOR THE UI ---

// Annotate the Students Entity
annotate PerformanceService.Students with @(
    UI.LineItem : [ // Defines the columns in the list view
        { Value: enrollmentID, Label: 'Enrollment ID' },
        { Value: firstName, Label: 'First Name' },
        { Value: lastName, Label: 'Last Name' },
        { Value: email, Label: 'Email' },
        { Value: gpa, Label: 'GPA' }
    ],
    UI.FieldGroup #General : { // Defines the fields on the object page
        Data : [
            { Value: enrollmentID },
            { Value: firstName },
            { Value: lastName },
            { Value: dateOfBirth },
            { Value: email },
            { Value: gpa }
        ]
    },
    UI.HeaderInfo : { // Defines the title on the object page
        TypeName : 'Student',
        TypeNamePlural : 'Students',
        Title : { Value: firstName },
        Description : { Value: lastName }
    },
    UI.Facets : [{
        $Type : 'UI.ReferenceFacet',
        Target : '@UI.FieldGroup#General',
        Label : 'General Information'
    }, {
        $Type : 'UI.ReferenceFacet',
        Target : 'enrollments/@UI.LineItem',
        Label : 'Class Enrollments'
    }, {
        $Type : 'UI.ReferenceFacet',
        Target : 'attendanceRecords/@UI.LineItem',
        Label : 'Attendance Records'
    }]
);

// Annotate the Teachers Entity
annotate PerformanceService.Teachers with @(
    UI.LineItem : [
        { Value: employeeID, Label: 'Employee ID' },
        { Value: firstName, Label: 'First Name' },
        { Value: lastName, Label: 'Last Name' },
        { Value: department, Label: 'Department' },
        { Value: email, Label: 'Email' }
    ],
    UI.FieldGroup #General : {
        Data : [
            { Value: employeeID },
            { Value: firstName },
            { Value: lastName },
            { Value: department },
            { Value: email }
        ]
    },
    UI.HeaderInfo : {
        TypeName : 'Teacher',
        TypeNamePlural : 'Teachers',
        Title : { Value: firstName },
        Description : { Value: lastName }
    },
    UI.Facets : [{
        $Type : 'UI.ReferenceFacet',
        Target : '@UI.FieldGroup#General',
        Label : 'General Information'
    }, {
        $Type : 'UI.ReferenceFacet',
        Target : 'classesTaught/@UI.LineItem',
        Label : 'Classes Taught'
    }]
);

// Annotate the Classes Entity
annotate PerformanceService.Classes with @(
    UI.LineItem : [
        { Value: classCode, Label: 'Class Code' },
        { Value: title, Label: 'Class Title' },
        { Value: teacher.firstName, Label: 'Teacher' },
        { Value: description, Label: 'Description' }
    ],
    UI.FieldGroup #General : {
        Data : [
            { Value: classCode },
            { Value: title },
            { Value: description },
            { Value: teacher_ID, Label: 'Teacher' }
        ]
    },
    UI.HeaderInfo : {
        TypeName : 'Class',
        TypeNamePlural : 'Classes',
        Title : { Value: title },
        Description : { Value: classCode }
    },
    UI.Facets : [{
        $Type : 'UI.ReferenceFacet',
        Target : '@UI.FieldGroup#General',
        Label : 'General Information'
    }, {
        $Type : 'UI.ReferenceFacet',
        Target : 'enrollments/@UI.LineItem',
        Label : 'Enrolled Students'
    }, {
        $Type : 'UI.ReferenceFacet',
        Target : 'exams/@UI.LineItem',
        Label : 'Exams'
    }]
);

// Annotate the Exams Entity
annotate PerformanceService.Exams with @(
    UI.LineItem : [
        { Value: title, Label: 'Exam Title' },
        { Value: examDate, Label: 'Exam Date' },
        { Value: maxScore, Label: 'Max Score' },
        { Value: class.title, Label: 'Class' },
        { Value: averageScore, Label: 'Average Score' },
        { Value: passRate, Label: 'Pass Rate (%)' }
    ],
    UI.FieldGroup #General : {
        Data : [
            { Value: title },
            { Value: examDate },
            { Value: maxScore },
            { Value: class_ID, Label: 'Class' }
        ]
    },
    UI.HeaderInfo : {
        TypeName : 'Exam',
        TypeNamePlural : 'Exams',
        Title : { Value: title },
        Description : { Value: class.title }
    }
);

// Annotate the PerformanceMetrics Entity
annotate PerformanceService.PerformanceMetrics with @(
    UI.LineItem : [
        { Value: student.firstName, Label: 'Student' },
        { Value: exam.title, Label: 'Exam' },
        { Value: score, Label: 'Score' },
        { Value: grade, Label: 'Grade' },
        { Value: comments, Label: 'Comments' }
    ],
    UI.FieldGroup #General : {
        Data : [
            { Value: student_ID, Label: 'Student' },
            { Value: exam_ID, Label: 'Exam' },
            { Value: score },
            { Value: grade },
            { Value: comments }
        ]
    },
    UI.HeaderInfo : {
        TypeName : 'Performance Record',
        TypeNamePlural : 'Performance Records',
        Title : { Value: student.firstName },
        Description : { Value: exam.title }
    }
);

// Annotate the AttendanceRecords Entity
annotate PerformanceService.AttendanceRecords with @(
    UI.LineItem : [
        { Value: student.firstName, Label: 'Student' },
        { Value: class.title, Label: 'Class' },
        { Value: date, Label: 'Date' },
        { Value: status, Label: 'Status' },
        { Value: remarks, Label: 'Remarks' }
    ],
    UI.FieldGroup #General : {
        Data : [
            { Value: student_ID, Label: 'Student' },
            { Value: class_ID, Label: 'Class' },
            { Value: date },
            { Value: status },
            { Value: remarks }
        ]
    },
    UI.HeaderInfo : {
        TypeName : 'Attendance Record',
        TypeNamePlural : 'Attendance Records',
        Title : { Value: student.firstName },
        Description : { Value: class.title }
    }
);

// Annotate the ClassEnrollments Entity
annotate PerformanceService.ClassEnrollments with @(
    UI.LineItem : [
        { Value: student.firstName, Label: 'Student Name' },
        { Value: student.enrollmentID, Label: 'Enrollment ID' },
        { Value: class.title, Label: 'Class Title' },
        { Value: enrollmentDate, Label: 'Enrollment Date' }
    ],
    UI.FieldGroup #General : {
        Data : [
            { Value: student_ID, Label: 'Student' },
            { Value: class_ID, Label: 'Class' },
            { Value: enrollmentDate }
        ]
    },
    UI.HeaderInfo : {
        TypeName : 'Class Enrollment',
        TypeNamePlural : 'Class Enrollments',
        Title : { Value: student.firstName },
        Description : { Value: class.title }
    }
);
