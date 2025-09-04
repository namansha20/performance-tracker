sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'exams.exams',
            componentId: 'ExamsList',
            contextPath: '/Exams'
        },
        CustomPageDefinitions
    );
});