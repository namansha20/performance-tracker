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
}

// --- ANNOTATIONS FOR THE UI ---

// Annotate the Students Entity
annotate PerformanceService.Students with @(
    UI.LineItem : [ // Defines the columns in the list view
        { Value: enrollmentID, Label: 'Enrollment ID' },
        { Value: firstName, Label: 'First Name' },
        { Value: lastName, Label: 'Last Name' },
        { Value: email, Label: 'Email' }
    ],
    UI.FieldGroup #General : { // Defines the fields on the object page
        Data : [
            { Value: enrollmentID },
            { Value: firstName },
            { Value: lastName },
            { Value: dateOfBirth },
            { Value: email }
        ]
    },
    UI.HeaderInfo : { // Defines the title on the object page
        TypeName : 'Student',
        TypeNamePlural : 'Students',
        Title : { Value: firstName },
        Description : { Value: lastName }
    }
);

// Annotate the Teachers Entity
annotate PerformanceService.Teachers with @(
    UI.LineItem : [
        { Value: employeeID, Label: 'Employee ID' },
        { Value: firstName, Label: 'First Name' },
        { Value: lastName, Label: 'Last Name' },
        { Value: department, Label: 'Department' }
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
    }
);
