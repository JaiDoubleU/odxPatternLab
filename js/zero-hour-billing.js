    var superTicketTable;
    var totalValue;
    // build a map for the allocation summary
    // map should have a key of afe, cc, major.minor.sub to amounts
    var allocationSummary = new Map();
    var driverSummary = new Map();
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
    var lineItemsTableStart =
        "<table width='100%' class='table table-bordered table-condensed table-striped'>" +
        "<thead>" +
        "<th width='36'>Line #</th>" +
        "<th class='text-center' width='36'>Alert</th>" +
        "<th>Part #/ Item ID</th>" +
        "<th>Description</th>" +
        "<th>Service Start</th>" +
        "<th>Service End</th>" +
        "<th>Location</th>" +
        "<th>Quantity</th>" +
        "<th>Units</th>" +
        "<th>Rate</th>" +
        "<th>Subtotal</th>" +
        "</thead>" +
        "<tbody>";
    var lineItemsTableEnd =
        "</tbody>" +
        "</table>";

    function format(d) {
        return 'Full name: ' + d.id + ' ' + d.serviceDate + '<br>' +
            'The child row can contain any data you wish, including links, images, inner tables etc.';
    }

    var initSuperTicketDataTable = function () {
        superTicketTable = $('#superTicketList').DataTable({
            rowId: 'ticketNumber',
            responsive: true,
            colReorder: true,
            "order": [
                [2, 'asc']
            ],
            oLanguage: defaultDataTablesOLanguage,
            columns: [
                { // 0
                    "class": "details-control text-center",
                    "orderable": false,
                    data: 'id',
                    "width": 36,
                    "render": function (data, type, row, meta) {
                        return (
                            '<i id="' + data + '" class="far fa-plus-square fa-fw"></i>'
                        );
                    }
                },
                { // 1
                    "width": 36,
                    "class": "text-center text-nowrap",
                    "orderable": false,
                    "render": function (data, type, row, meta) {
                        return (
                            '<div class="checkbox"><label><input class="stCheckbox" type="checkbox"></label></div>'
                        );
                    }
                },
                { // 2
                    "width": 36,
                    "class": "text-center text-nowrap",
                    data: 'severity'
                },
                { // 3
                    "class": "text-nowrap",
                    data: 'ticketNumber'
                },
                { //4
                    "class": "text-nowrap",
                    data: 'supplierName'
                },
                { // 5
                    "width": 85,
                    "class": "text-nowrap",
                    data: 'startDate'
                },
                { //6
                    "class": "text-nowrap",
                    data: 'endDate'
                },
                { //7
                    "class": "text-nowrap",
                    data: 'driverName'
                },
                { //8
                    "width": 90,
                    "class": "text-nowrap",
                    data: 'hours'
                },
                { // 9
                     "width": 90,
                    "class": "text-nowrap",
                    data: 'coding'
                },
                { //10
                    "class": "text-nowrap",
                    data: 'superintendent'
                },
                {
                    data: 'location'
                },
                {
                    "class": "text-nowrap",
                    data: 'status'
                },
                {
                    "width": 75,
                    "class": "text-center text-nowrap",
                    data: 'attachments'
                },
                {
                    "width": 60,
                    "class": "text-nowrap",
                    data: 'currency'
                }, { // 11
                    "class": "text-right text-nowrap",
                    data: 'amount',
                    "render": function (data, type, row, meta) {
                        return (
                            data.toFixed(2)
                        );
                    }
                }
            ],
            "lengthMenu": defaultDataTablesLengthMenu,
            "ajax": "../../styleguide/data/anomaly24HourTicketListData.json",
            "sDom": defaultDataTablesSDom,
            "createdRow": function (row, data, dataIndex) {
                //console.error('row is ' +data.id);
                var nextKey = {};
                var nextDriverKey = {};
                var roundNumber = function (num, n) {
                    return parseFloat(Math.round(num * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n);
                };

                // build the allocationSummary map
                nextKey.afe = data.afe;
                nextKey.cc = data.cc;
                nextKey.coding = data.coding;
                nextKey.toString = data.afe + ':' + data.cc + ':' + data.coding;
                var nextAmount = parseFloat(data.amount);
                if (allocationSummary.has(nextKey.toString)) {
                    // calculate the new amount and update the map
                    var amountInMap = parseFloat(allocationSummary.get(nextKey.toString));
                    var newTotal = amountInMap + nextAmount;
                    allocationSummary.set(nextKey.toString, roundNumber(nextAmount + amountInMap, 2));
                } else {
                    // add the new key and amount to the map
                    allocationSummary.set(nextKey.toString, roundNumber(nextAmount, 2));
                }

                 // build the driverSummary map
                 nextDriverKey.driverName = data.driverName;
                 nextDriverKey.date = data.date;
                 nextDriverKey.toString = data.driverName + ':' + data.date;

                 var nextHours = parseFloat(data.hours);
                 if (driverSummary.has(nextDriverKey) ){
                     // calculate the new amount and update the map
                     var hoursInMap = parseFloat(driverSummary.get(nextDriverKey.toString));
                     driverSummary.set(nextDriverKey, nextHours + hoursInMap);
                 } else {
                     // add the new key and amount to the map
                     driverSummary.set(nextDriverKey, nextHours);
                 }

                // build the statusSummary map
                var nextStatus = data.status;
                if (statusSummary.has(nextStatus)) {
                    // increment count and update the map
                    var countInMap = statusSummary.get(nextStatus);
                    var newCount = countInMap + 1;
                    statusSummary.set(nextStatus, newCount);
                } else {
                    // add the new key and amount to the map
                    statusSummary.set(nextStatus, 1);
                }

                // build the compliance summary map
                var nextAlert = data.severity;
                if (complianceSummary.has(nextAlert)) {
                    // increment count and update the map
                    var count = complianceSummary.get(nextAlert);
                    var updatedCount = count + 1;
                    complianceSummary.set(nextAlert, updatedCount);
                } else {
                    // add the new key and amount to the map
                    complianceSummary.set(nextAlert, 1);
                }
                // console.error(complianceSummary);

                // console.error('line items: ' + data.lineItems.length +', data index: ' +dataIndex);
                $.each(data.lineItems, function (i, lineItemData) {
                    updateTicketLineItemsMap(data.ticketNumber, lineItemData);
                });
            },
            "initComplete": function (settings, json) {
                //generateLineItemsSummaryTable();

                //generateAllocationSummaryTable();
                //generateDriverSummaryTable();

                //generateStatusSummaryTable();

                //generateComplianceSummaryTable();

                // set active allocation summary row
                if (activeAllocationSummaryRow) {
                    $('#' + activeAllocationSummaryRow).addClass('selected');
                }
            },
            "footerCallback": function (row, data, start, end, display) {
                var api = this.api();

                // converting to interger to find total
                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                        i : 0;
                };

                // calculate a total volume for the entire data set
                var totalVolume = api.column(15).data().reduce(
                    function (a, b) {
                        return intVal(a * 0.85) + intVal(b * 0.90);
                    }, 0);

                // computing column Total of the complete result
                totalValue = api.column(15).data().reduce(
                    function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);


                $('[name="total-amount"]').html('USD ' + (totalValue).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
                $('[id="stUOM"]').html('m<sup>3</sup>');
                $('[id="stTotalVol"]').html((totalVolume).toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
                $('[id="stAverage"]').html('USD ' + (totalValue / totalVolume).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + ' / m<sup>3</sup>');
            }
        });

        $('#superTicketList tbody').on('click', 'td.details-control', function () {
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
                var mappedLineItems = ticketLineItemsMap.get(selectedTicketNumber);
                var nextLine = "<tr id='" + selectedTicketNumber + "Details" + "'><td colspan='16'> <label>Line Items: </label>" + lineItemsTableStart;
                $.each(mappedLineItems, function (i, lineItemData) {
                    nextLine += "<tr>";
                    nextLine += "   <td>" + lineItemData.lineNumber + "</td>";
                    if (lineItemData.lineAlert == true) {
                        nextLine += "   <td class='text-center'><i class='fas fa-shield text-success'></i></td>";
                    } else {
                        nextLine += "<td></td>";
                    }
                    nextLine += "   <td>" + lineItemData.partNumber + "</td>";
                    nextLine += "   <td>" + lineItemData.description + "</td>";
                    nextLine += "   <td>" + lineItemData.startDate + "</td>";
                    nextLine += "   <td>" + lineItemData.endDate + "</td>";
                    nextLine += "   <td>" + lineItemData.location + "</td>";
                    nextLine += "   <td>" + lineItemData.quantity + "</td>";
                    nextLine += "   <td>" + lineItemData.units + "</td>";
                    nextLine += "   <td>" + lineItemData.rate + "</td>";
                    nextLine += "   <td>" + lineItemData.subtotal + "</td>";
                    nextLine += "</tr>";
                });
                nextLine += lineItemsTableEnd;
                nextLine += "</td></tr>";
                $(nextLine).insertAfter(tr);
            }
        });
    };

    clearSuperTicketFilters = function () {
        $('#superTicketList').dataTable().search("").draw();
    };
    var toggleShowMoreLessButons = function () {
        $('#allocationSummaryShowMore').toggleClass('hide');
        $('#allocationSummaryShowLess').toggleClass('hide');
    }
    // generates the allocation summary table based on the data in the ticket list
    // var generateAllocationSummaryTable = function () {
    //     if ($('#allocationSummaryContent')) {
    //         $('#allocationSummaryContent').remove();
    //     }
    //     if ($('#allocationSummaryCollapsedContent')) {
    //         $('#allocationSummaryCollapsedContent').remove();
    //     }
    //     var allocSummaryContent = "<tbody id='allocationSummaryContent'>";
    //     $("#superTicketAllocationSummary").append(allocSummaryContent);

    //     var allocSummaryCollapsedContent = "<tbody id='allocationSummaryCollapsedContent' class='collapse'>";
    //     $("#superTicketAllocationSummary").append(allocSummaryCollapsedContent);

    //     if ($('#allocationSummaryContent')) {
    //         var rowCount = 0;
    //         var hiddenRowCount = 0;
    //         for (var [key, value] of allocationSummary) {
    //             var fields = key.split(':');
    //             var rowContent = "<tr id='row" + rowCount + "'>" +
    //                 "<td class='text-left'>" + fields[0] + "</td>" +
    //                 "<td class='text-left'>" + fields[1] + "</td>" +
    //                 "<td class='text-left'>" + fields[2] + "</td>" +
    //                 "<td class='text-right'>" + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); + "</td></tr>";

    //             // show the first 2 rows by default and collapse the rest
    //             if (rowCount < 2) {
    //                 $("#allocationSummaryContent").append(rowContent);
    //             } else {
    //                 $("#allocationSummaryCollapsedContent").append(rowContent);
    //                 hiddenRowCount++;
    //             }
    //             rowCount++;

    //             if (rowCount == 2) {
    //                 $("#allocationSummaryContent").append('</tbody>');
    //             }
    //         }
    //         $("#allocationSummaryCollapsedContent").append('</tbody>');

    //         var footerRow = "<tfoot>" +
    //             "<tr id='footerRow'><td colspan='4'>" +
    //             " <a id='allocationSummaryShowMore' onclick='toggleShowMoreLessButons();' class='' data-toggle='collapse' href='#allocationSummaryCollapsedContent'> More <i class='fa fa-chevron-down'></i></a>" +
    //             " <a id='allocationSummaryShowLess' onclick='toggleShowMoreLessButons();' class='hide' data-toggle='collapse' href='#allocationSummaryCollapsedContent'> Less <i class='fa fa-chevron-up'></i></a>" +
    //             "</td ></tr> </tfoot>";
    //         $("#superTicketAllocationSummary").append(footerRow);
    //     }
    // };

    $('#clearSuperTicketFiltersBtn').on('click', function () {
        superTicketTable.search('').draw();
        setTimeout(function () {
            $('#tableFilteredFeedback').addClass('hide');
        }, 200);
    });

    // // add an onclick to the allocation summary table to act as a filter
    // $('#superTicketAllocationSummary').on('click', 'tr', function () {
    //     var tr = $(this).closest('tr');
    //     activeAllocationSummaryRow = tr.attr('id');
    //     if (activeAllocationSummaryRow != 'footerRow') {
    //         if (!$('#' + activeAllocationSummaryRow).hasClass('selected')) {
    //             if ($('.selected')) {
    //                 $('.selected').removeClass('selected');
    //             }
    //             $('#' + activeAllocationSummaryRow).addClass('selected');
    //             var tds = tr.children();
    //             var selectedAfe = tds[0].innerText;
    //             var selectedCC = tds[1].innerText;
    //             var selectedCoding = tds[2].innerText;
    //             var searchString = selectedAfe + ' ' + selectedCC + ' ' + selectedCoding;
    //             // apply the filter on the ticket list
    //             superTicketTable.search(searchString).draw();
    //             $('#tableFilteredFeedback').removeClass('hide');
    //         } else {
    //             setTimeout(function () {
    //                 $('#' + activeAllocationSummaryRow).toggleClass('selected');
    //             }, 200);
    //             superTicketTable.search("").draw();
    //             $('#tableFilteredFeedback').toggleClass('hide');
    //         }
    //     }
    // });


    var generateComplianceSummaryTable = function () {
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

                if (key == '2-Warning') {
                    // show the percent of tickets
                    yellowContent += "<td class='text-center ' width='33%' id='" + key + "' style='cursor: pointer;'>";
                    yellowContent += "<p> <strong class='small'>2 - Warning</strong > </p>";
                    yellowContent += "<div class='lead text-warning'>";
                    yellowContent += value ;
                    yellowContent += "</div><p> <strong class='small'> Tickets</strong></p>";
                    yellowContent += "</td>";
                } else if (key == '1-Severe') {
                    // show the dollar amount of off contract tickets
                    redContent += "<td class='text-center' width='33%' id='" + key + "' style='cursor: pointer;'>";
                    redContent += "<p><strong class='small'>1 - Severe </strong></p>";
                    redContent += "<div class='lead  text-danger'>";
                    redContent += value;
                    redContent += "</div><p> <strong class='small'> Tickets</strong></p>";
                    redContent += "</td>";
                } else if (key == '3-Flag') {
                    // show the number of compliant tickets
                    greenContent += "<td class='text-center' width='33%' id='" + key + "' style='cursor: pointer;'>";
                    greenContent += "<p><strong class='small'>3 - Flag</strong></p>";
                    greenContent += "<div class='lead  text-info'>";
                    greenContent += value;
                    greenContent += "</div><p> <strong class='small'> Tickets </strong></p>";
                    greenContent += "</td>";
                }

                rowCount++;
            }
            rowContent += redContent;
            rowContent += yellowContent;
            rowContent += greenContent;
            rowContent += "</tr>";
            $("#complianceSummaryContent").append(rowContent);
        }
    };

    // generates the status summary table based on the data in the ticket list
    var generateStatusSummaryTable = function () {
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

    var generateDriverSummaryTable = function () {
        if ($('#driverSummaryContent')) {
            //$('#driverSummaryContent').remove();
        }

       var sortedMap = new Map([...driverSummary].sort(([k, v], [k2, v2]) => {
           if (k.toString > k2.toString) {
               return 1;
           }
           if (k.toString < k2.toString) {
               return -1;
           }
           return 0;
       }));

        console.error(sortedMap);

        var driverSummaryContent = "";
        for (var [key, value] of sortedMap) {
            driverSummaryContent +=
                "<tr><td>" + key.driverName + "</td>" + "<td>" + key.date + "</td>" + "<td>" + value + "</td></tr>";
        }
        // driverSummaryContent += "</tbody>";
        console.error(driverSummaryContent);
        $("#driverSummaryContent").append(driverSummaryContent);
    };

    var generateLineItemsSummaryTable = function () {
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
                    title: "Part Number/Item ID"
                },
                {
                    title: "Description"
                },
                {
                    title: "Total Quantity"
                },
                {
                    title: "Units"
                },
                {
                    title: "Rate"
                }
            ],
            "order": [
                [1, 'asc']
            ],
            oLanguage: defaultDataTablesOLanguage,
            "sDom": defaultDataTablesSDom,
        });
    };

    $('#superTicketComplianceSummary').on('click', 'td', function () {
        activeComplianceSummaryCell = $(this).attr('id');

        if (!$('#' + activeComplianceSummaryCell).hasClass('selected')) {
            if ($('.selected')) {
                $('.selected').removeClass("selected");
            }

            $('#' + activeComplianceSummaryCell).addClass('selected');
            var alert = this.id;

            // apply the filter on the ticket list
            superTicketTable.search(alert).draw();
        } else {
            setTimeout(function () {
                $('#' + activeComplianceSummaryCell).toggleClass('selected');
            }, 300);

            superTicketTable.search("").draw();
        }
    });

    var updateTicketLineItemsMap = function (key, lineItemData) {
        var lineItems;
        if (ticketLineItemsMap.has(key)) {
            // increment count and update the map
            lineItems = ticketLineItemsMap.get(key);
            lineItems.push(lineItemData);
            ticketLineItemsMap.set(key, lineItems);
        } else {
            // add the new key and amount to the map
            lineItems = [];
            lineItems.push(lineItemData);
            ticketLineItemsMap.set(key, lineItems);
        }
        var lineItemsSummaryKey = lineItemData.partNumber + ':' + lineItemData.description + ':' + lineItemData.units + ':' + lineItemData.rate;
        var lineItemArray = [];
        if (lineItemsSummaryMap.has(lineItemsSummaryKey)) {
            // increment count and update the map
            lineItemArray = lineItemsSummaryMap.get(lineItemsSummaryKey);
            var newQuantity = lineItemArray.quantity += lineItemData.quantity;
            lineItemArray.quantity = newQuantity;
            lineItemsSummaryMap.set(lineItemsSummaryKey, lineItemArray);
        } else {
            // add the new key and amount to the map
            lineItemArray.partNumber = lineItemData.partNumber;
            lineItemArray.description = lineItemData.description;
            lineItemArray.units = lineItemData.units;
            lineItemArray.rate = lineItemData.rate;
            lineItemArray.quantity = lineItemData.quantity;
            lineItemsSummaryMap.set(lineItemsSummaryKey, lineItemArray);
            numGroupedLineItems++;
        }
    };
