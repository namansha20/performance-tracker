using PerformanceService as service from '../../srv/service';
annotate service.Exams with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'title',
                Value : title,
            },
            {
                $Type : 'UI.DataField',
                Label : 'examDate',
                Value : examDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'maxScore',
                Value : maxScore,
            },
            {
                $Type : 'UI.DataField',
                Label : 'averageScore',
                Value : averageScore,
            },
            {
                $Type : 'UI.DataField',
                Label : 'passRate',
                Value : passRate,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
);

annotate service.Exams with {
    class @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Classes',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : class_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'title',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'classCode',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'description',
            },
        ],
    }
};

