var drake;
var dashboardIsEditable = false;

// setup drag and drop elements
$('#editDashboardBtn').on('click', function () {
    drake = dragula({
        revertOnSpill: true
    }).on("drop", function (el, target, source, sibling) {
        var panel = createDashboardPanel(el);
        if(panel) {
            target.append(panel);
        }
    });

    $('.deleteBtn').each(function (i, button) {
        button.addEventListener("click", removeWidget, true);
    });

    var dragElement = document.getElementById('drag-elements');
    var dropLeftElement = document.getElementById('drop-target-left');
    var dropRightElement = document.getElementById('drop-target-right');

    dragElement.classList.add('grabbable');
    dropLeftElement.classList.add('grabbable');
    dropRightElement.classList.add('grabbable');


    drake.containers.push(dragElement);
    drake.containers.push(dropLeftElement);
    drake.containers.push(dropRightElement);
});

// function that removes a widget from the dashboard
var removeWidget = function (event) {
    drake.start(this);

    var list = $(event.target).closest('.col-sm-6');
    var panelToRemove = $(event.target).closest('.col-sm-6').children('#' + this.closest('.panel').id);

    panelToRemove.remove();

    var availableList = $('#drag-elements');
    availableList.append(panelToRemove);

    drake.end();
};

// function that toggles the dashboard between editable and readonly mode
var toggleDashboardEditability = function() {
    if (!dashboardIsEditable) {
        dashboardIsEditable = true;

        $('#editDashboardBtn').addClass('hide');
        $('#openInvoiceDashboard .panel-title .dropdown').addClass('hide');

        $('#saveDashboardBtn').removeClass('hide');
        $('#openInvoiceDashboard .panel-title .deleteBtn').removeClass('hide');
    } else {
        dashboardIsEditable = false;

        $('#editDashboardBtn').removeClass('hide');
        $('#openInvoiceDashboard .panel-title .dropdown').removeClass('hide');

        $('#openInvoiceDashboard .panel-title .deleteBtn').addClass('hide');
        $('#saveDashboardBtn').addClass('hide');
    }
};


// function that creates dashboard panel from the drag and drop element passed
function createDashboardPanel(el) {
    var title = el.dataset.title;
    var elementId = el.dataset.id;

    var elementExists = $('#' + elementId);
    if (!elementExists) {
        var panel = document.createElement("div");
        panel.setAttribute("id", elementId);

        panel.classList.add('panel');
        panel.classList.add('panel-default');

        var panelHeader = document.createElement("div");
        panelHeader.classList.add('panel-heading');

        var panelTitle = document.createElement("div");
        panelTitle.classList.add('panel-title');
        panelTitle.innerText = title;

        var deleteIcon = document.createElement("i");
        deleteIcon.classList.add('far');
        deleteIcon.classList.add('deleteIcon');
        deleteIcon.classList.add('fa-trash-alt');
        deleteIcon.classList.add('fa-fw');
        deleteIcon.classList.add('pull-right');
        deleteIcon.setAttribute('title', 'Remove Item');
        panelTitle.appendChild(deleteIcon);

        panelHeader.appendChild(panelTitle);

        panel.appendChild(panelHeader);

        var panelBody = document.createElement("div");
        panelBody.classList.add('panel-body');

        panel.appendChild(panelBody);
        return panel;
    }
}
