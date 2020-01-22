function setActiveCrumb(crumbNumber) {
    console.error('setting active crumb to ' +crumbNumber);
    $('.btn-breadcrumb .active').toggleClass('active');
    $('.btn-breadcrumb').children().eq(parseInt(crumbNumber)).toggleClass('active');
}

