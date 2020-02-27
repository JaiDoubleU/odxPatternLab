    var anomaliesTable;
    var totalValue;
    // build a map for the allocation summary
    // map should have a key of afe, cc, major.minor.sub to amounts
    var allocationSummary = new Map();
    var ticketChildRowsMap = new Map();
    var statusSummary = new Map();
    var complianceSummary = new Map();
    var activeAllocationSummaryRow;
    var activeComplianceSummaryRow;
    var lineItemsSummaryMap = new Map();
    var lineItemSummaryTableData;
    var numGroupedLineItems = 0;
    var ticketLineItemsMap = new Map();
    var clearSuperTicketFilters;
    var ticketsTableStart =
        "<table width='100%' class='table table-bordered table-condensed table-striped'>" +
        "<thead>" +
        "<th width='36'>Ticket #</th>" +
        "<th class='text-center' width='36'>Alert</th>" +
        "<th>Driver Name</th>" +
        "<th>Service Description</th>" +
        "<th>Date</th>" +
        "<th>Disposal Location</th>" +
        "<th>Quantity</th>" +
        "<th>Units</th>" +
        "<th>Rate</th>" +
        "<th>Subtotal</th>" +
        "<th class='text-center'>Link</th>" +
        "</thead>" +
        "<tbody>";
    var ticketsTableEnd =
        "</tbody>" +
        "</table>";

    function openDocumentViewerWindow() {
        window.open("http://styleguide.transzap.com/?p=pages-documentViewer", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=1200,height=600");
    }

    function format(d) {
        return 'Full name: ' + d.id + ' ' + d.serviceDate + '<br>' +
            'The child row can contain any data you wish, including links, images, inner tables etc.';
    }

    function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            var negativeSign = amount < 0 ? "-" : "";

            var i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            var j = (i.length > 3) ? i.length % 3 : 0;

            return '$' + negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            // console.log(e)
        }
    };

    var openAnomalyView = function(theHref) {
        document.querySelector('.pl').parentNode.location = theHref;
    }
    var initAnomaliesDataTable = function() {
        anomaliesTable = $('#anomaliesList').DataTable({
            rowId: 'anomalyNumber',
            responsive: true,
            colReorder: true,
            "order": [
                [6, 'desc']
            ],
            oLanguage: defaultDataTablesOLanguage,
            columns: [{
                    "class": "details-control text-center",
                    "orderable": false,
                    data: 'id',
                    "width": 36,
                    "render": function(data, type, row, meta) {
                        return (
                            '<i id="' + data + '" class="far fa-plus-square fa-fw"></i>'
                        );
                    }
                }, {

                    "class": "text-center text-nowrap",
                    "orderable": false,
                    // "width": 36,
                    "render": function(data, type, row, meta) {
                        return (
                            '<label><input class="stCheckbox" type="checkbox"></label>'
                        );
                    }
                }, {
                    "class": "text-nowrap",
                    data: 'anomalyNumber'
                }, {
                    "class": "text-nowrap",
                    data: 'anomalyType'
                }, {
                    "class": "text-nowrap",
                    data: 'supplierName'
                }, {
                    "class": "text-nowrap",
                    data: 'severity'
                }, {
                    "width": 50,
                    "class": "text-nowrap",
                    data: 'anomalyDate'
                }, { //5
                    "class": "text-nowrap",
                    data: 'age'
                }, { //5
                    "width": 35,
                    "class": "text-nowrap",
                    data: 'records'
                }, { //6
                    "class": "text-right text-nowrap",
                    data: 'amount',
                    "render": function(data, type, row, meta) {
                        return (
                            formatMoney(data.toFixed(2))
                        );
                    }
                }, { //9
                    "width": 70,
                    "class": "text-nowrap",
                    data: 'actions',
                    "render": function(data, type, row, meta) {
                        var btnGroup = '<div class="btn-group btn-group-sm">';
                        btnGroup += '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown">';
                        btnGroup += 'Actions';
                        btnGroup += '<span class="caret"></span>';
                        btnGroup += '</button>';
                        btnGroup += '<ul class="dropdown-menu dropdown-menu-right">';
                        for (var index = 0; index < data.length; index++) {
                            var elem = data[index];
                            btnGroup += '<li><a href="#"  data-toggle="modal" data-target="#resizableModal">' + elem + '</a></li>';
                        }
                        btnGroup += '</ul>';
                        btnGroup += '</div>';
                        return btnGroup;
                    }
                }
                // ,
                // {
                //     "class": "text-nowrap",
                //     data: 'requisitioner'
                // },
                // {
                //     "class": "text-nowrap",
                //     data: 'superintendent'
                // },
                // {
                //     data: 'location'
                // },
                // {
                //     "class": "text-nowrap",
                //     data: 'status'
                // },
                // {
                //     "width": 75,
                //     "class": "text-center text-nowrap",
                //     data: 'attachments'
                // },
                // {
                //     "width": 60,
                //     "class": "text-nowrap",
                //     data: 'currency'
                // }, { // 11
                //     "class": "text-right text-nowrap",
                //     data: 'amount',
                //     "render": function (data, type, row, meta) {
                //         return (
                //             data.toFixed(2)
                //         );
                //     }
                // }
            ],
            "lengthMenu": defaultDataTablesLengthMenu,
            "ajax": "../styleguide/data/anomaliesListPatternData.json",
            "sDom": defaultDataTablesSDom,
            "createdRow": function(row, data, dataIndex) {
                var tableCells = row.cells;
                for (var index = 2; index < tableCells.length - 1; index++) {
                    var cell = tableCells[index];
                    var anomalyViewUrl = document.getElementById('anomalyViewHref').value;
                    cell.style.cursor = "pointer";
                    cell.addEventListener("click", function() {
                        openAnomalyView(anomalyViewUrl)
                    });
                }

                //     //console.error('row is ' +data.id);
                //     var nextKey = {};
                //     var roundNumber = function (num, n) {
                //         return parseFloat(Math.round(num * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n);
                //     };

                //     // build the allocationSummary map
                //     nextKey.afe = data.afe;
                //     nextKey.cc = data.cc;
                //     nextKey.coding = data.coding;
                //     nextKey.toString = data.afe + ':' + data.cc + ':' + data.coding;
                //     var nextAmount = parseFloat(data.amount);
                //     if (allocationSummary.has(nextKey.toString)) {
                //         // calculate the new amount and update the map
                //         var amountInMap = parseFloat(allocationSummary.get(nextKey.toString));
                //         var newTotal = amountInMap + nextAmount;
                //         allocationSummary.set(nextKey.toString, roundNumber(nextAmount + amountInMap, 2));
                //     } else {
                //         // add the new key and amount to the map
                //         allocationSummary.set(nextKey.toString, roundNumber(nextAmount, 2));
                //     }

                //     // build the statusSummary map
                //     var nextStatus = data.status;
                //     if (statusSummary.has(nextStatus)) {
                //         // increment count and update the map
                //         var countInMap = statusSummary.get(nextStatus);
                //         var newCount = countInMap + 1;
                //         statusSummary.set(nextStatus, newCount);
                //     } else {
                //         // add the new key and amount to the map
                //         statusSummary.set(nextStatus, 1);
                //     }

                //     // build the compliance summary map
                //     var nextAlert = data.ticketAlert;
                //     if (complianceSummary.has(nextAlert)) {
                //         // increment count and update the map
                //         var count = complianceSummary.get(nextAlert);
                //         var updatedCount = count + 1;
                //         complianceSummary.set(nextAlert, updatedCount);
                //     } else {
                //         // add the new key and amount to the map
                //         complianceSummary.set(nextAlert, 1);
                //     }
                //     //console.error(complianceSummary);

                // console.error('line items: ' + data.lineItems.length +', data index: ' +dataIndex);
                $.each(data.tickets, function(i, ticketData) {
                    updateTicketLineItemsMap(data.anomalyNumber, ticketData);
                });
            },
            "initComplete": function(settings, json) {
                // generateLineItemsSummaryTable();

                // generateAllocationSummaryTable();

                // generateStatusSummaryTable();

                // generateComplianceSummaryTable();

                // // set active allocation summary row
                // if (activeAllocationSummaryRow) {
                //     $('#' + activeAllocationSummaryRow).addClass('selected');
                // }
            },
            "footerCallback": function(row, data, start, end, display) {
                // var api = this.api();

                // // converting to interger to find total
                // var intVal = function (i) {
                //     return typeof i === 'string' ?
                //         i.replace(/[\$,]/g, '') * 1 :
                //         typeof i === 'number' ?
                //         i : 0;
                // };

                // // calculate a total volume for the entire data set
                // var totalVolume = api.column(15).data().reduce(
                //     function (a, b) {
                //         return intVal(a * 0.85) + intVal(b * 0.90);
                //     }, 0);

                // // computing column Total of the complete result
                // totalValue = api.column(15).data().reduce(
                //     function (a, b) {
                //         return intVal(a) + intVal(b);
                //     }, 0);


                // $('[name="total-amount"]').html('USD ' + (totalValue).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
                // $('[id="stUOM"]').html('m<sup>3</sup>');
                // $('[id="stTotalVol"]').html((totalVolume).toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
                // $('[id="stAverage"]').html('USD ' + (totalValue / totalVolume).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' / m<sup>3</sup>');
            }
        });


        $('#anomaliesList tbody').on('click', 'td.details-control', function() {
            var tr = $(this).closest('tr');
            var selectedTicketNumber = (tr.attr("id") * 1);
            var selectedTicketDetails = $('#' + selectedTicketNumber + 'Details');
            var domSelectedTicket = document.getElementById(selectedTicketNumber + 'Details');

            var openDetailsRow = $("[id$='Details']");
            if (openDetailsRow) {
                openDetailsRow.remove();
            }

            if (domSelectedTicket) {
                // the details row is already in the dom, so remove it
                selectedTicketDetails.remove();
            } else {
                // create the detail row for the selected ticket
                var mappedTickets = ticketLineItemsMap.get(selectedTicketNumber);
                var nextLine = "<tr style='background-color: #eee;' id='" + selectedTicketNumber + "Details" + "'><td colspan='16'> <label>Tickets: </label>" + ticketsTableStart;
                $.each(mappedTickets, function(i, ticketData) {
                    nextLine += "<tr>";
                    nextLine += "   <td>" + ticketData.ticketNumber + "</td>";
                    if (ticketData.lineAlert == true) {
                        nextLine += "   <td class='text-center'><i class='fas fa-shield text-success'></i></td>";
                    } else {
                        nextLine += "<td></td>";
                    }
                    nextLine += "   <td>" + ticketData.driverName + "</td>";
                    nextLine += "   <td>" + ticketData.description + "</td>";
                    nextLine += "   <td>" + ticketData.ticketDate + "</td>";
                    // nextLine += "   <td>" + ticketData.endDate + "</td>";
                    nextLine += "   <td>" + ticketData.disposalLocation + "</td>";
                    nextLine += "   <td class='text-right'>" + ticketData.quantity + "</td>";
                    nextLine += "   <td>" + ticketData.units + "</td>";
                    nextLine += "   <td  class='text-right'>" + formatMoney(ticketData.rate) + "</td>";
                    nextLine += "   <td class='text-right'>" + formatMoney(ticketData.subtotal) + "</td>";
                    nextLine += "   <td class='text-center'> <a class='btn-link' onclick='openDocumentViewerWindow()'><i class='far fa-external-link'></i> View Ticket </a></td>"
                    nextLine += "</tr>";
                });
                nextLine += ticketsTableEnd;
                nextLine += "</td></tr>";
                $(nextLine).insertAfter(tr);
            }
        });
    };

    clearSuperTicketFilters = function() {
        $('#anomaliesList').dataTable().search("").draw();
    };
    var toggleShowMoreLessButons = function() {
            $('#allocationSummaryShowMore').toggleClass('hide');
            $('#allocationSummaryShowLess').toggleClass('hide');
        }
        // generates the allocation summary table based on the data in the ticket list
    var generateAllocationSummaryTable = function() {
        if ($('#allocationSummaryContent')) {
            $('#allocationSummaryContent').remove();
        }
        if ($('#allocationSummaryCollapsedContent')) {
            $('#allocationSummaryCollapsedContent').remove();
        }
        var allocSummaryContent = "<tbody id='allocationSummaryContent'>";
        $("#superTicketAllocationSummary").append(allocSummaryContent);

        var allocSummaryCollapsedContent = "<tbody id='allocationSummaryCollapsedContent' class='collapse'>";
        $("#superTicketAllocationSummary").append(allocSummaryCollapsedContent);

        if ($('#allocationSummaryContent')) {
            var rowCount = 0;
            var hiddenRowCount = 0;
            for (var [key, value] of allocationSummary) {
                var fields = key.split(':');
                var rowContent = "<tr id='row" + rowCount + "'>" +
                    "<td class='text-left'>" + fields[0] + "</td>" +
                    "<td class='text-left'>" + fields[1] + "</td>" +
                    "<td class='text-left'>" + fields[2] + "</td>" +
                    "<td class='text-right'>" + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); + "</td></tr>";

                // show the first 2 rows by default and collapse the rest
                if (rowCount < 2) {
                    $("#allocationSummaryContent").append(rowContent);
                } else {
                    $("#allocationSummaryCollapsedContent").append(rowContent);
                    hiddenRowCount++;
                }
                rowCount++;

                if (rowCount == 2) {
                    $("#allocationSummaryContent").append('</tbody>');
                }
            }
            $("#allocationSummaryCollapsedContent").append('</tbody>');

            var footerRow = "<tfoot>" +
                "<tr id='footerRow'><td colspan='4'>" +
                " <a id='allocationSummaryShowMore' onclick='toggleShowMoreLessButons();' class='' data-toggle='collapse' href='#allocationSummaryCollapsedContent'> More <i class='fa fa-chevron-down'></i></a>" +
                " <a id='allocationSummaryShowLess' onclick='toggleShowMoreLessButons();' class='hide' data-toggle='collapse' href='#allocationSummaryCollapsedContent'> Less <i class='fa fa-chevron-up'></i></a>" +
                "</td ></tr> </tfoot>";
            $("#superTicketAllocationSummary").append(footerRow);
        }
    };
    $('#clearSuperTicketFiltersBtn').on('click', function() {
        anomaliesTable.search('').draw();
        setTimeout(function() {
            $('#tableFilteredFeedback').addClass('hide');
        }, 200);
    });

    // add an onclick to the allocation summary table to act as a filter
    $('#superTicketAllocationSummary').on('click', 'tr', function() {
        var tr = $(this).closest('tr');
        activeAllocationSummaryRow = tr.attr('id');
        if (activeAllocationSummaryRow != 'footerRow') {
            if (!$('#' + activeAllocationSummaryRow).hasClass('selected')) {
                if ($('.selected')) {
                    $('.selected').removeClass('selected');
                }
                $('#' + activeAllocationSummaryRow).addClass('selected');
                var tds = tr.children();
                var selectedAfe = tds[0].innerText;
                var selectedCC = tds[1].innerText;
                var selectedCoding = tds[2].innerText;
                var searchString = selectedAfe + ' ' + selectedCC + ' ' + selectedCoding;
                // apply the filter on the ticket list
                anomaliesTable.search(searchString).draw();
                $('#tableFilteredFeedback').removeClass('hide');
            } else {
                setTimeout(function() {
                    $('#' + activeAllocationSummaryRow).toggleClass('selected');
                }, 200);
                anomaliesTable.search("").draw();
                $('#tableFilteredFeedback').toggleClass('hide');
            }
        }
    });


    var generateComplianceSummaryTable = function() {
        if ($('#complianceSummaryContent')) {
            $('#complianceSummaryContent').remove();
        }
        var complianceSummaryContent = "<tbody id='complianceSummaryContent'>";
        $("#superTicketComplianceSummary").append(complianceSummaryContent);

        if ($('#complianceSummaryContent')) {
            var rowCount = 0;
            var rowContent = "<tr>";
            var redContent;
            var yellowContent;
            var greenContent;
            for (var [key, value] of complianceSummary) {

                var alertIcon = '<div class="form-group"><span class="fa-stack">';

                if (key == 'Yellow') {
                    // show the percent of tickets
                    yellowContent += "<td class='text-center' width='33%' id='" + key + "' style='cursor: pointer;'>";
                    yellowContent += "<p> <strong class='small'>Off Pricebook</strong></p>";
                    alertIcon += '<i class="fas fa-shield fa-fw fa-stack-2x fa-lg " style="color: #FFAD30;"></i>' +
                        '<i class="fas fa-question fa-fw fa-stack-1x"></i>' +
                        '</span>';
                    alertIcon += '</div>';

                    yellowContent += alertIcon;
                    var percentOnContract = "34.5%";
                    yellowContent += "<div class='h5'>";
                    yellowContent += percentOnContract;
                    yellowContent += " of Tickets</div>";
                    yellowContent += "</td>";
                } else if (key == 'Red') {
                    // show the dollar amount of off contract tickets
                    redContent += "<td class='text-center' width='33%' id='" + key + "' style='cursor: pointer;'>";
                    redContent += "<p><strong class='small'>No Pricebook</strong></p>";

                    alertIcon += '<i class="fas fa-shield fa-stack-2x fa-lg text-danger"></i>' +
                        '<i class="fas fa-exclamation fa-stack-1x fa-inverse"></i>' +
                        '</span>';
                    alertIcon += '</div>';

                    redContent += alertIcon;
                    var valueOffContract = totalValue * 0.18;
                    redContent += "<div class='h5'>";
                    redContent += 'USD ' + (valueOffContract).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    redContent += "</div>";
                    redContent += "</td>";
                } else if (key == 'Green') {
                    // show the number of compliant tickets
                    greenContent += "<td class='text-center' width='33%' id='" + key + "' style='cursor: pointer;'>";
                    greenContent += "<p><strong class='small'>Fully Compliant</strong></p>";
                    alertIcon += '<i class="fas fa-shield fa-stack-2x fa-lg text-success"></i>' +
                        '<i class="fas fa-check fa-stack-1x fa-inverse"></i>' +
                        '</span>';
                    alertIcon += '</div>';

                    greenContent += alertIcon;
                    greenContent += "<div class='h5'>";
                    greenContent += value;
                    greenContent += " Tickets</div>";
                    greenContent += "</td>";
                }

                rowCount++;
            }
            rowContent += greenContent;
            rowContent += yellowContent;
            rowContent += redContent;
            rowContent += "</tr>";
            $("#complianceSummaryContent").append(rowContent);
        }
    };

    // generates the status summary table based on the data in the ticket list
    var generateStatusSummaryTable = function() {
        if ($('#statusSummaryContent')) {
            $('#statusSummaryContent').remove();
        }
        var statusSummaryContent = "<tr id='statusSummaryContent'>";
        for (var [key, value] of statusSummary) {
            statusSummaryContent +=
                "<td class='text-center'>" + value + "</td>";
        }
        statusSummaryContent += "</tr>";

        $("#statusSummary tbody").append(statusSummaryContent);
    };

    var generateLineItemsSummaryTable = function() {
        var count = 0;
        lineItemSummaryTableData = [];

        var calculatedData = []
        for (const [key, value] of lineItemsSummaryMap.entries()) {
            calculatedData[count] = [value.partNumber, value.description, JSON.stringify(value.quantity), value.units, value.rate];
            count++;
        }

        $('#lineItemSummaryTable').DataTable({
            data: calculatedData,
            columns: [{
                title: "Driver Name"
            }, {
                title: "Description"
            }, {
                title: "Total Quantity"
            }, {
                title: "Units"
            }, {
                title: "Rate"
            }],
            "order": [
                [1, 'asc']
            ],
            oLanguage: defaultDataTablesOLanguage,
            "sDom": defaultDataTablesSDom,
        });
    };

    $('#superTicketComplianceSummary').on('click', 'td', function() {
        activeComplianceSummaryCell = $(this).attr('id');

        if (!$('#' + activeComplianceSummaryCell).hasClass('selected')) {
            if ($('.selected')) {
                $('.selected').removeClass("selected");
            }

            $('#' + activeComplianceSummaryCell).addClass('selected');
            var alert = this.id;

            // apply the filter on the ticket list
            anomaliesTable.search(alert).draw();
        } else {
            setTimeout(function() {
                $('#' + activeComplianceSummaryCell).toggleClass('selected');
            }, 300);

            anomaliesTable.search("").draw();
        }
    });



    var updateTicketLineItemsMap = function(key, ticketData) {
        var tickets;
        if (ticketLineItemsMap.has(key)) {
            // increment count and update the map
            tickets = ticketLineItemsMap.get(key);
            tickets.push(ticketData);
            ticketLineItemsMap.set(key, tickets);
        } else {
            // add the new key and amount to the map
            tickets = [];
            tickets.push(ticketData);
            ticketLineItemsMap.set(key, tickets);
        }
        var lineItemsSummaryKey = ticketData.partNumber + ':' + ticketData.description + ':' + ticketData.units + ':' + ticketData.rate;
        var lineItemArray = [];
        if (lineItemsSummaryMap.has(lineItemsSummaryKey)) {
            // increment count and update the map
            lineItemArray = lineItemsSummaryMap.get(lineItemsSummaryKey);
            var newQuantity = lineItemArray.quantity += ticketData.quantity;
            lineItemArray.quantity = newQuantity;
            lineItemsSummaryMap.set(lineItemsSummaryKey, lineItemArray);
        } else {
            // add the new key and amount to the map
            lineItemArray.partNumber = ticketData.partNumber;
            lineItemArray.description = ticketData.description;
            lineItemArray.units = ticketData.units;
            lineItemArray.rate = ticketData.rate;
            lineItemArray.quantity = ticketData.quantity;
            lineItemsSummaryMap.set(lineItemsSummaryKey, lineItemArray);
            numGroupedLineItems++;
        }
    };