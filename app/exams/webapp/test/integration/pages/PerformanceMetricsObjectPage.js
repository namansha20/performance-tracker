sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'exams.exams',
            componentId: 'PerformanceMetricsObjectPage',
            contextPath: '/Exams/scores'
        },
        CustomPageDefinitions
    );
});