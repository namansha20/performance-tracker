sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'fioriui.teachers',
            componentId: 'TeachersList',
            contextPath: '/Teachers'
        },
        CustomPageDefinitions
    );
});